import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import GeneratedPlanView from '../../views/GeneratedPlanView.vue'
import * as api from '../../services/api'

const mockPush = vi.fn()
const mockToast = {
  success: vi.fn(),
  error: vi.fn()
}

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

vi.mock('vue-toastification', () => ({
  useToast: () => mockToast
}))

vi.mock('../../services/api', () => ({
  createPersonalizedPlan: vi.fn()
}))

describe('GeneratedPlanView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('questionnaireProfile', 'procrastinador')
    localStorage.setItem('questionnaireId', '777')
  })

  it('muestra el perfil y badge correcto basado en el localStorage', () => {
    const wrapper = mount(GeneratedPlanView)
    expect(wrapper.text()).toContain('Procrastinador')
    expect(wrapper.text()).toContain('⏳')
  })

  it('persiste el plan en la base de datos al hacer clic en Comenzar mi día', async () => {
    api.createPersonalizedPlan.mockResolvedValue({ idPlan: 1 })
    const wrapper = mount(GeneratedPlanView)
    
    await wrapper.find('button.bg-violet-700').trigger('click')
    
    expect(api.createPersonalizedPlan).toHaveBeenCalledWith(expect.objectContaining({
      idCuestionario: 777,
      enfoqueDiario: 5
    }))
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })

  it('mapea correctamente los detalles del plan para el perfil "critico"', async () => {
    localStorage.setItem('questionnaireProfile', 'critico')
    const wrapper = mount(GeneratedPlanView)
    
    expect(wrapper.text()).toContain('21:30:00') 
    expect(wrapper.text()).toContain('5') 
  })
})