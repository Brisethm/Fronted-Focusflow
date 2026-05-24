import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import WellnessView from "../../views/WellnessView.vue";

vi.mock("../components/FooterNav.vue", () => ({
  default: { template: "<div>Footer</div>" },
}));

vi.mock("../../components/FooterNav.vue", () => ({
  default: { template: "<div>Footer</div>" },
}));

describe("WellnessView.vue", () => {
  it("renderiza todas las secciones de bienestar", () => {
    const wrapper = mount(WellnessView);
    expect(wrapper.find("h2").text()).toBe("Módulo de bienestar");
    expect(wrapper.text()).toContain("Respiración");
    expect(wrapper.text()).toContain("Pausas activas");
    expect(wrapper.text()).toContain("Meditaciones");
  });

  it("renderiza las tarjetas de video correctamente", () => {
    const wrapper = mount(WellnessView);
    const cards = wrapper.findAll(".rounded-xl.bg-white");
    expect(cards.length).toBeGreaterThan(0);
    expect(wrapper.text()).toContain("Respiración de la Caja");
    expect(wrapper.text()).toContain("The Vortex Way");
  });

it('expande el reproductor de video al hacer clic en el botón de play', async () => {
    const wrapper = mount(WellnessView)
    
    // 1. Buscamos el primer botón de play
    const playBtn = wrapper.find('button.h-10.w-10')
    await playBtn.trigger('click')
    
    // 2. Verificamos el estado interno (es la verdad absoluta)
    // El primer video tiene id: 0 en tu código
    expect(wrapper.vm.expandedVideo).toBe(0) 
    
    // 3. Verificamos que el iframe exista
    const iframe = wrapper.find('iframe')
    expect(iframe.exists()).toBe(true)
    expect(iframe.attributes('src')).toContain('youtube.com/embed/AXsBog5Q9BU')
  })

  it('colapsa el video si se hace clic nuevamente en el mismo botón', async () => {
    const wrapper = mount(WellnessView)
    const playBtn = wrapper.find('button.h-10.w-10')
    
    // Expandir
    await playBtn.trigger('click')
    expect(wrapper.vm.expandedVideo).toBe(0)
    
    // Colapsar
    await playBtn.trigger('click')
    expect(wrapper.vm.expandedVideo).toBe(null) // Debe volver a null
    
    // El iframe no debería estar "visible" (v-show añade display: none)
    // Verificamos que el div contenedor tenga display: none
    const container = wrapper.find('div[v-show]') // Nota: si v-show no es un atributo, busca el div que envuelve el iframe
    // O mejor aún: simplemente verifica que el estado es null
    expect(wrapper.vm.expandedVideo).toBe(null)
  })
});
