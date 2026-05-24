import { flushPromises, mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SupportChatModal from "../../components/support/SupportChatModal.vue";
import * as api from "../../services/api.js";

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

vi.mock("../../services/api.js", () => ({
  getTicketResponses: vi.fn(),
  sendTicketResponse: vi.fn(),
  getAuthToken: vi.fn(() => "fake-token"),
  getTicketHubUrl: vi.fn(() => "http://localhost/hub"),
}));

vi.mock("vue-toastification", () => ({
  useToast: () => ({
    error: vi.fn(),
    success: vi.fn(),
  }),
}));

describe("SupportChatModal.vue", () => {
  const mockTicket = {
    idTicket: 123,
    asunto: "Error de prueba",
    descripcion: "Descripción de prueba",
    estado: "open",
    fechaCreacion: "2023-10-10T10:00:00Z",
  };

  const mockResponses = [
    {
      idRespuesta: 1,
      mensaje: "Hola",
      esSoporte: true,
      fecha: "2023-10-10T11:00:00Z",
    },
    {
      idRespuesta: 2,
      mensaje: "¿Cómo estás?",
      esSoporte: false,
      fecha: "2023-10-10T11:05:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.getTicketResponses.mockResolvedValue(mockResponses);
  });

  it("renderiza la información del ticket correctamente", async () => {
    const wrapper = mount(SupportChatModal, {
      props: { ticket: mockTicket },
    });

    expect(wrapper.text()).toContain("Ticket #123");
    expect(wrapper.text()).toContain("Error de prueba");
    expect(wrapper.text()).toContain("Descripción de prueba");
  });

  it("carga y muestra los mensajes iniciales", async () => {
    const wrapper = mount(SupportChatModal, {
      props: { ticket: mockTicket },
    });

    await flushPromises();

    expect(wrapper.vm.responses.length).toBe(2);
    const textContent = wrapper.text();
    expect(textContent).toContain("Hola");
    expect(textContent).toContain("¿Cómo estás?");
  });

  it("implementa lógica optimista al enviar un mensaje", async () => {
    api.sendTicketResponse.mockImplementation(() => new Promise(() => {}));

    const wrapper = mount(SupportChatModal, {
      props: { ticket: mockTicket },
    });

    await wrapper.setData({ newMessage: "Mensaje nuevo" });
    await wrapper.find("form").trigger("submit.prevent");

    expect(
      wrapper.vm.responses.some((r) => r.mensaje === "Mensaje nuevo"),
    ).toBe(true);
    expect(wrapper.vm.newMessage).toBe("");
    expect(api.sendTicketResponse).toHaveBeenCalledWith(123, "Mensaje nuevo");
  });

  it("reemplaza el mensaje optimista cuando la API confirma el envío", async () => {
    const confirmedMessage = {
      idRespuesta: 999,
      mensaje: "Mensaje nuevo",
      esSoporte: false,
      fecha: new Date().toISOString(),
    };
    api.sendTicketResponse.mockResolvedValueOnce(confirmedMessage);

    const wrapper = mount(SupportChatModal, {
      props: { ticket: mockTicket },
    });

    await wrapper.setData({ newMessage: "Mensaje nuevo" });
    await wrapper.find("form").trigger("submit.prevent");

    await flushPromises();

    const finalMsg = wrapper.vm.responses.find(
      (r) => r.mensaje === "Mensaje nuevo",
    );
    expect(finalMsg.idRespuesta).toBe(999);
  });

  it("evita mensajes duplicados desde SignalR", async () => {
    const wrapper = mount(SupportChatModal, {
      props: { ticket: mockTicket },
    });
    await flushPromises();

    const duplicateMessage = {
      idRespuesta: 1,
      mensaje: "Hola",
      esSoporte: true,
      fecha: "2023-10-10T11:00:00Z",
    };
    wrapper.vm.handleRealtimeMessage([duplicateMessage]);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.responses.length).toBe(2);
  });

  it("bloquea el formulario si el ticket está cerrado", async () => {
    const closedTicket = { ...mockTicket, estado: "closed" };
    const wrapper = mount(SupportChatModal, {
      props: { ticket: closedTicket },
    });
    await flushPromises();
    expect(wrapper.find("form").exists()).toBe(false);
    expect(wrapper.text()).toContain("Este ticket está cerrado");
  });

  it("emite el evento close al hacer clic en cerrar", async () => {
    const wrapper = mount(SupportChatModal, {
      props: { ticket: mockTicket },
    });
    await wrapper
      .find(String.raw`button.text-text-light-secondary.hover\:text-red-500`)
      .trigger("click");
    expect(wrapper.emitted()).toHaveProperty("close");
  });

  it("maneja el cambio de visibilidad deteniendo e iniciando SignalR correctamente", async () => {
    const wrapper = mount(SupportChatModal, {
      props: { ticket: mockTicket },
    });
    await flushPromises();

    const stopSpy = vi.spyOn(wrapper.vm, "stopSignalR");
    const setupSpy = vi.spyOn(wrapper.vm, "setupSignalR");

    // Simular que la pestaña se oculta (debe llamar a stopSignalR)
    Object.defineProperty(document, "hidden", { value: true, writable: true });
    await wrapper.vm.handleVisibilityChange();
    expect(stopSpy).toHaveBeenCalled();

    // Simular que la pestaña vuelve a ser visible (debe llamar a setupSignalR con el ID)
    Object.defineProperty(document, "hidden", { value: false, writable: true });
    await wrapper.vm.handleVisibilityChange();
    expect(setupSpy).toHaveBeenCalledWith(mockTicket.idTicket);
  });
});
