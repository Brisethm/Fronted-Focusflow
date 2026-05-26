import { flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SupportChatModal from "../../components/support/SupportChatModal.vue";
import { baseTicket, mountChatModal } from "./ticketChatModalTestUtils.js";
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
  updateTicketStatus: vi.fn(),
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
    ...baseTicket,
    idTicket: 123,
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
      mensaje: "Como estas?",
      esSoporte: false,
      fecha: "2023-10-10T11:05:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.getTicketResponses.mockResolvedValue(mockResponses);
  });

  it("renderiza la informacion del ticket correctamente", async () => {
    const { wrapper } = mountChatModal(SupportChatModal, mockTicket);

    expect(wrapper.text()).toContain("Ticket #123");
    expect(wrapper.text()).toContain("Error de prueba");
    expect(wrapper.text()).toContain("Descripcion de prueba");
  });

  it("carga y muestra los mensajes iniciales", async () => {
    const { wrapper, chat } = mountChatModal(SupportChatModal, mockTicket);

    await flushPromises();

    expect(chat().vm.responses.length).toBe(2);
    expect(wrapper.text()).toContain("Hola");
    expect(wrapper.text()).toContain("Como estas?");
  });

  it("implementa logica optimista al enviar un mensaje", async () => {
    api.sendTicketResponse.mockImplementation(() => new Promise(() => {}));

    const { chat } = mountChatModal(SupportChatModal, mockTicket);
    const chatWrapper = chat();

    await chatWrapper.setData({ newMessage: "Mensaje nuevo" });
    await chatWrapper.find("form").trigger("submit.prevent");

    expect(
      chatWrapper.vm.responses.some((r) => r.mensaje === "Mensaje nuevo"),
    ).toBe(true);
    expect(chatWrapper.vm.newMessage).toBe("");
    expect(api.sendTicketResponse).toHaveBeenCalledWith(123, "Mensaje nuevo");
  });

  it("reemplaza el mensaje optimista cuando la API confirma el envio", async () => {
    api.sendTicketResponse.mockResolvedValueOnce({
      idRespuesta: 999,
      mensaje: "Mensaje nuevo",
      esSoporte: false,
      fecha: new Date().toISOString(),
    });

    const { chat } = mountChatModal(SupportChatModal, mockTicket);
    const chatWrapper = chat();

    await chatWrapper.setData({ newMessage: "Mensaje nuevo" });
    await chatWrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    const finalMsg = chatWrapper.vm.responses.find(
      (r) => r.mensaje === "Mensaje nuevo",
    );
    expect(finalMsg.idRespuesta).toBe(999);
  });

  it("evita mensajes duplicados desde SignalR", async () => {
    const { chat } = mountChatModal(SupportChatModal, mockTicket);
    const chatWrapper = chat();
    await flushPromises();

    chatWrapper.vm.handleRealtimeMessage([mockResponses[0]]);
    await chatWrapper.vm.$nextTick();

    expect(chatWrapper.vm.responses.length).toBe(2);
  });

  it("bloquea el formulario si el ticket esta cerrado", async () => {
    const { wrapper } = mountChatModal(SupportChatModal, {
      ...mockTicket,
      estado: "closed",
    });

    await flushPromises();
    expect(wrapper.find("form").exists()).toBe(false);
    expect(wrapper.text()).toContain("Este ticket esta cerrado");
  });

  it("emite el evento close al hacer clic en cerrar", async () => {
    const { wrapper } = mountChatModal(SupportChatModal, mockTicket);

    await wrapper
      .find(String.raw`button.text-text-light-secondary.hover\:text-red-500`)
      .trigger("click");

    expect(wrapper.emitted()).toHaveProperty("close");
  });

  it("maneja el cambio de visibilidad deteniendo e iniciando SignalR correctamente", async () => {
    const { chat } = mountChatModal(SupportChatModal, mockTicket);
    const chatWrapper = chat();
    await flushPromises();

    const stopSpy = vi.spyOn(chatWrapper.vm, "stopSignalR");
    const setupSpy = vi.spyOn(chatWrapper.vm, "setupSignalR");

    Object.defineProperty(document, "hidden", { value: true, writable: true });
    await chatWrapper.vm.handleVisibilityChange();
    expect(stopSpy).toHaveBeenCalled();

    Object.defineProperty(document, "hidden", { value: false, writable: true });
    await chatWrapper.vm.handleVisibilityChange();
    expect(setupSpy).toHaveBeenCalledWith(mockTicket.idTicket);
  });
});
