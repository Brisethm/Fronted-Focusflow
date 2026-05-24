import { flushPromises, mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SupportView from "../../views/SupportView.vue";
import * as api from "../../services/api";

// Mock de dependencias externas
const mockBack = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({
    back: mockBack,
  }),
  useRoute: () => ({
    path: "/support",
  }),
}));

const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
};
vi.mock("vue-toastification", () => ({
  useToast: () => mockToast,
}));

vi.mock("../../services/api", () => ({
  getMyTickets: vi.fn(),
  createTicket: vi.fn(),
}));

describe("SupportView.vue", () => {
  const TICKET_CACHE_KEY = "focusflow:support:tickets";
  const mockTickets = [
    {
      idTicket: 1,
      asunto: "Error en timer",
      categoria: "technical",
      prioridad: "high",
      descripcion: "El timer no pita",
      estado: "open",
      fechaCreacion: "2023-10-01T10:00:00Z",
    },
    {
      idTicket: 2,
      asunto: "Sugerencia UX",
      categoria: "feature_request",
      prioridad: "low",
      descripcion: "Cambiar colores",
      estado: "closed",
      fechaCreacion: "2023-10-02T10:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    api.getMyTickets.mockResolvedValue(mockTickets);
  });

  it("renderiza correctamente el estado inicial y carga tickets", async () => {
    const wrapper = mount(SupportView);

    expect(api.getMyTickets).toHaveBeenCalled();

    await flushPromises();

    expect(wrapper.findAll(".ticket-card").length).toBe(2);
  });

  it("hidrata los tickets desde el cache de sesión", async () => {
    sessionStorage.setItem(TICKET_CACHE_KEY, JSON.stringify(mockTickets));

    const wrapper = mount(SupportView);

    // Fuerza a que Vue procese el ciclo de vida del componente
    await flushPromises();

    expect(wrapper.findAll(".ticket-card").length).toBe(2);
  });

  it('muestra el formulario de creación al hacer clic en "Nuevo Ticket"', async () => {
    api.getMyTickets.mockResolvedValueOnce([]);
    const wrapper = mount(SupportView);
    await flushPromises();

    const newBtn = wrapper.find("button.bg-primary");
    await newBtn.trigger("click");

    expect(wrapper.find("form").exists()).toBe(true);
    expect(wrapper.find("h3").text()).toContain("Crear Solicitud");
  });

  it("valida y envía un nuevo ticket exitosamente", async () => {
    const wrapper = mount(SupportView);
    await flushPromises();

    const newBtn = wrapper.find("button.bg-primary");
    await newBtn.trigger("click");

    await flushPromises();

    const form = wrapper.find("form");
    expect(form.exists()).toBe(true);

    await form.find('input[type="text"]').setValue("Mi nuevo problema");
    await form
      .find("textarea")
      .setValue("Descripción larga del problema técnico");
    await form.findAll("select")[0].setValue("technical");

    api.createTicket.mockResolvedValueOnce({ success: true });

    await form.trigger("submit.prevent");

    expect(api.createTicket).toHaveBeenCalledWith(
      expect.objectContaining({
        asunto: "Mi nuevo problema",
        categoria: "technical",
      }),
    );
    expect(mockToast.success).toHaveBeenCalledWith(
      "¡Ticket enviado correctamente!",
    );

    expect(wrapper.vm.showForm).toBe(false);
  });

  it("normaliza la información del ticket para su visualización", async () => {
    const wrapper = mount(SupportView);
    await flushPromises();

    const firstTicket = wrapper.vm.tickets[0];
    expect(firstTicket.displayStatus).toBe("Abierto");
    expect(firstTicket.displayCategory).toBe("Bug / Técnico");
    // El formato de fecha depende del locale, verificamos que no sea el ISO original
    expect(firstTicket.displayDate).not.toBe("2023-10-01T10:00:00Z");
  });

  it("asigna la clase de estado correcta según el ticket", async () => {
    const wrapper = mount(SupportView);
    await flushPromises();

    const openPill = wrapper.findAll(".status-pill")[0];
    expect(openPill.classes()).toContain("bg-blue-100");

    const closedPill = wrapper.findAll(".status-pill")[1];
    expect(closedPill.classes()).toContain("bg-gray-100");
  });

  it('incrementa la cantidad de tickets visibles al hacer clic en "Ver más"', async () => {
    // Generar 15 tickets falsos
    const manyTickets = Array.from({ length: 15 }, (_, i) => ({
      ...mockTickets[0],
      idTicket: i,
    }));
    api.getMyTickets.mockResolvedValueOnce(manyTickets);

    const wrapper = mount(SupportView);
    await flushPromises();

    expect(wrapper.findAll(".ticket-card").length).toBe(10); // INITIAL_VISIBLE_TICKETS

    await wrapper.find("button.w-full.py-3").trigger("click");
    expect(wrapper.findAll(".ticket-card").length).toBe(15);
  });
});
