import { flushPromises, mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TicketsChatModal from "../../components/support/TicketsChatModal.vue";
import * as api from "../../services/api.js";

// Mock de SignalR
const signalRMocks = vi.hoisted(() => ({
  mockOn: vi.fn(),
  mockInvoke: vi.fn(),
  mockStart: vi.fn().mockResolvedValue(),
  mockStop: vi.fn().mockResolvedValue(),
}));
const { mockOn, mockInvoke, mockStart, mockStop } = signalRMocks;

vi.mock("@microsoft/signalr", () => ({
  HubConnectionBuilder: vi.fn().mockImplementation(() => ({
    withUrl: vi.fn().mockReturnThis(),
    withAutomaticReconnect: vi.fn().mockReturnThis(),
    build: vi.fn().mockReturnValue({
      on: mockOn,
      invoke: mockInvoke,
      start: mockStart,
      stop: mockStop,
      onreconnecting: vi.fn(),
      onreconnected: vi.fn(),
      onclose: vi.fn(),
    }),
  })),
}));

// Mock de API
vi.mock("../../services/api.js", () => ({
  getTicketResponses: vi.fn(),
  sendTicketResponse: vi.fn(),
  updateTicketStatus: vi.fn(),
  getAuthToken: vi.fn(() => "staff-token"),
  getTicketHubUrl: vi.fn(() => "http://localhost/hub"),
}));

// Mock de Toast
vi.mock("vue-toastification", () => ({
  useToast: () => ({
    error: vi.fn(),
    success: vi.fn(),
  }),
}));

describe("TicketsChatModal.vue", () => {
  const mockTicket = {
    idTicket: 456,
    asunto: "Error de carga",
    descripcion: "El usuario no puede ver sus tareas",
    estado: "open",
    fechaCreacion: "2023-10-15T10:00:00Z",
  };

  const mockResponses = [
    {
      idRespuesta: 1,
      mensaje: "No carga mi lista",
      esSoporte: false,
      fecha: "2023-10-15T10:05:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.getTicketResponses.mockResolvedValue(mockResponses);
  });

  it("renderiza la información del ticket y los mensajes del usuario", async () => {
    const wrapper = mount(TicketsChatModal, {
      props: { ticket: mockTicket },
    });

    await flushPromises();

    expect(wrapper.text()).toContain("Ticket #456");
    expect(wrapper.text()).toContain("Error de carga");
    expect(wrapper.text()).toContain("No carga mi lista");
  });

  it("permite al personal de soporte cambiar el estado del ticket", async () => {
    const wrapper = mount(TicketsChatModal, {
      props: { ticket: mockTicket },
    });

    const select = wrapper.find("select");
    await select.setValue("resolved");
    await select.trigger("change");

    expect(api.updateTicketStatus).toHaveBeenCalledWith(456, "resolved");
    expect(wrapper.emitted()).toHaveProperty("status-updated");
    expect(wrapper.emitted()["status-updated"][0]).toEqual(["resolved"]);
  });

  it('envía una respuesta y cambia el estado a "En Revisión" automáticamente si estaba abierto', async () => {
    const confirmedRes = {
      idRespuesta: 10,
      mensaje: "Estamos trabajando en ello",
      esSoporte: true,
      fecha: new Date().toISOString(),
    };
    api.sendTicketResponse.mockResolvedValueOnce(confirmedRes);

    const wrapper = mount(TicketsChatModal, {
      props: { ticket: mockTicket },
    });

    await wrapper.setData({ newMessage: "Estamos trabajando en ello" });
    await wrapper.find("form").trigger("submit.prevent");

    expect(api.sendTicketResponse).toHaveBeenCalledWith(
      456,
      "Estamos trabajando en ello",
    );
    // El estado local debe cambiar a in_progress
    expect(wrapper.vm.localTicket.estado).toBe("in_progress");
    expect(wrapper.emitted()["status-updated"]).toBeTruthy();
  });

  it("bloquea el envío de mensajes si el ticket está cerrado", async () => {
    const closedTicket = { ...mockTicket, estado: "closed" };
    const wrapper = mount(TicketsChatModal, {
      props: { ticket: closedTicket },
    });

    expect(wrapper.find("form").exists()).toBe(false);
    expect(wrapper.text()).toContain("Este ticket se encuentra cerrado");
  });

  it("evita duplicar mensajes recibidos por tiempo real", async () => {
    const wrapper = mount(TicketsChatModal, {
      props: { ticket: mockTicket },
    });
    await flushPromises();

    // Atacamos directamente tu método de procesamiento igual que en SupportChatModal
    const duplicate = {
      idRespuesta: 1,
      mensaje: "No carga mi lista",
      esSoporte: false,
      fecha: "2023-10-15T10:05:00Z",
    };
    wrapper.vm.handleRealtimeMessage([duplicate]);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.responses.length).toBe(1); // No se duplica

    // Inyectamos uno nuevo
    const nuevo = {
      idRespuesta: 2,
      mensaje: "Prueba live",
      esSoporte: false,
      fecha: new Date().toISOString(),
    };
    wrapper.vm.handleRealtimeMessage([nuevo]);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.responses.length).toBe(2); // Se agrega correctamente
  });
});
