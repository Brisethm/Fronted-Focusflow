import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRouter } from "vue-router";
import { submitQuestionnaire as mockSubmitRequest } from "../../services/api";
import Questionnaire from "../../views/OnboardingQuestionnaireView.vue";


vi.mock("vue-router", () => ({
  useRouter: vi.fn(),
}));

vi.mock("../../services/api", () => ({
  submitQuestionnaire: vi.fn(),
}));

describe("Questionnaire.vue - Pruebas unitarias de Cobertura (AAA)", () => {
  let wrapper;
  let mockRouterPush;

  beforeEach(() => {
    vi.clearAllMocks();
    
    
    mockRouterPush = vi.fn();
    useRouter.mockReturnValue({ push: mockRouterPush });
    
    
    Storage.prototype.setItem = vi.fn();
  });

  it("Debe inicializarse en la primera pregunta y deshabilitar botón anterior", async () => {
    
    wrapper = mount(Questionnaire);

    
    const textHeader = wrapper.find("header").text();
    const prevButton = wrapper.find("footer button:nth-child(1)");

    
    expect(textHeader).toContain("1 / 7");
    expect(prevButton.element.disabled).toBe(true);
  });

  it("Debe permitir seleccionar una opción y habilitar el botón Siguiente", async () => {
    
    wrapper = mount(Questionnaire);
    
    
    const firstOptionButton = wrapper.find("main section button");
    await firstOptionButton.trigger("click"); 
    
    const nextButton = wrapper.find("footer div button:nth-child(1)");

    
    expect(firstOptionButton.classes()).toContain("border-primary"); 
    expect(nextButton.element.disabled).toBe(false);
  });

  it("Debe avanzar y retroceder correctamente de pregunta", async () => {
    
    wrapper = mount(Questionnaire);
    await wrapper.find("main section button").trigger("click"); 
    
    
    const nextButton = wrapper.find("footer div button:nth-child(1)");
    await nextButton.trigger("click"); 

    
    expect(wrapper.find("header").text()).toContain("2 / 7");

    
    const prevButton = wrapper.find("footer button:nth-child(1)");
    await prevButton.trigger("click");

    
    expect(wrapper.find("header").text()).toContain("1 / 7");
  });

  it("Debe completar todo el flujo, calcular perfil equilibrado y redirigir", async () => {
    
    mockSubmitRequest.mockResolvedValue({ data: { idCuestionario: 999 } });
    wrapper = mount(Questionnaire);

    
    for (let i = 0; i < 7; i++) {
      await wrapper.find("main section button").trigger("click");
      if (i < 6) {
        const nextButton = wrapper.find("footer div button:nth-child(1)");
        await nextButton.trigger("click");
      }
    }

    
    const finishButton = wrapper.find("footer div button:nth-child(2)");
    expect(finishButton.element.disabled).toBe(false);

    
    await finishButton.trigger("click");

    
    expect(mockSubmitRequest).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith("questionnaireProfile", "equilibrado");
    expect(localStorage.setItem).toHaveBeenCalledWith("questionnaireId", "999");
    expect(mockRouterPush).toHaveBeenCalledWith("/generated-plan");
  });

  it("Debe renderizar un mensaje de error si el servicio API falla", async () => {
    
    mockSubmitRequest.mockRejectedValue(new Error("Error de conexión con el servidor FocusFlow"));
    wrapper = mount(Questionnaire);

    
    for (let i = 0; i < 7; i++) {
      await wrapper.find("main section button").trigger("click");
      if (i < 6) await wrapper.find("footer div button:nth-child(1)").trigger("click");
    }

    
    const finishButton = wrapper.find("footer div button:nth-child(2)");
    await finishButton.trigger("click");

    
    await wrapper.vm.$nextTick(); 

    
    const errorParagraph = wrapper.find("p.text-red-700");
    expect(errorParagraph.exists()).toBe(true);
    expect(errorParagraph.text()).toContain("Error de conexión con el servidor FocusFlow");
  });
});
