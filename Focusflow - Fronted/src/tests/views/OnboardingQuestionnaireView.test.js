import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import OnboardingQuestionnaireView from '../../views/OnboardingQuestionnaireView.vue'
import * as api from '../../services/api'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

vi.mock('../../services/api', () => ({
  submitQuestionnaire: vi.fn()
}))

describe('OnboardingQuestionnaireView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renderiza la primera pregunta correctamente', () => {
    const wrapper = mount(OnboardingQuestionnaireView)
    expect(wrapper.text()).toContain('Gestion del tiempo')
    expect(wrapper.text()).toContain('¿Cómo describes tu habilidad para gestionar tu tiempo?')
    expect(wrapper.find('span.text-primary').text()).toBe('1 / 7')
  })

  it('permite seleccionar una opción y avanzar al siguiente paso', async () => {
    const wrapper = mount(OnboardingQuestionnaireView)
    
    // Seleccionar la primera opción (Excelente...)
    const options = wrapper.findAll('section button')
    await options[0].trigger('click')
    
    // El botón Siguiente debería estar habilitado
    const nextBtn = wrapper.findAll('footer button').find(b => b.text().includes('Siguiente'))
    expect(nextBtn.element.disabled).toBe(false)
    
    await nextBtn.trigger('click')
    expect(wrapper.find('span.text-primary').text()).toBe('2 / 7')
  })

  it('calcula el perfil y finaliza el cuestionario', async () => {
    api.submitQuestionnaire.mockResolvedValue({ idCuestionario: 999 })
    const wrapper = mount(OnboardingQuestionnaireView)
    
    // Responder todas las preguntas (7) seleccionando siempre la primera opción
    for (let i = 0; i < 7; i++) {
      const options = wrapper.findAll('section button')
      await options[0].trigger('click')
      
      if (i < 6) {
        const nextBtn = wrapper.findAll('footer button').find(b => b.text().includes('Siguiente'))
        await nextBtn.trigger('click')
      }
    }

    const finishBtn = wrapper.findAll('footer button').find(b => b.text().includes('Finalizar cuestionario'))
    expect(finishBtn.element.disabled).toBe(false)
    
    await finishBtn.trigger('click')
    
    expect(api.submitQuestionnaire).toHaveBeenCalledWith(expect.objectContaining({
      completado: true,
      puntajeTotal: expect.any(Number),
      perfil: expect.any(String)
    }))
    
    // Verificamos persistencia
    expect(localStorage.getItem('questionnaireId')).toBe('999')
    expect(localStorage.getItem('questionnaireProfile')).toBeDefined()
    
    // Redirección
    expect(mockPush).toHaveBeenCalledWith('/generated-plan')
  })
})