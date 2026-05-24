import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdjustPlanView from '../../views/AdjustPlanView.vue'
import * as api from '../../services/api'


const mockPush = vi.fn()
const mockBack = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack
  })
}))

const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn()
}
vi.mock('vue-toastification', () => ({
  useToast: () => mockToast
}))

vi.mock('../../services/api', () => ({
  getUserPlans: vi.fn(),
  createPersonalizedPlan: vi.fn(),
  updatePlan: vi.fn()
}))

describe('AdjustPlanView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem('questionnaireId', '555')
    api.getUserPlans.mockResolvedValue([])
  })

  it('inicializa con valores por defecto si no hay plan previo', async () => {
    const wrapper = mount(AdjustPlanView)
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.find('.text-5xl').text()).toBe('3') 
    expect(wrapper.findAll('.text-5xl')[1].text()).toBe('1') 
  })

  it('carga datos del plan existente desde la API', async () => {
    api.getUserPlans.mockResolvedValueOnce([{
      idPlan: 10,
      horaDescanso: '23:30:00',
      pausasDiarias: 6,
      enfoqueDiario: 3
    }])

    const wrapper = mount(AdjustPlanView)
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('23')
    expect(wrapper.text()).toContain('30')
    expect(wrapper.text()).toContain('6')
  })

  it('permite incrementar y decrementar el enfoque diario', async () => {
    const wrapper = mount(AdjustPlanView)
    const sections = wrapper.findAll('.rounded-3xl')
    const enfoqueSection = sections[2]
    
    const btnInc = enfoqueSection.findAll('button').find(b => b.text() === '+')
    await btnInc.trigger('click')
    expect(wrapper.text()).toContain('2')
    
    const btnDec = enfoqueSection.findAll('button').find(b => b.text() === '-')
    await btnDec.trigger('click')
    expect(wrapper.text()).toContain('1')
  })

  it('valida la existencia de questionnaireId antes de guardar', async () => {
    localStorage.removeItem('questionnaireId')
    const wrapper = mount(AdjustPlanView)
    
    await wrapper.find('footer button').trigger('click')
    
    expect(mockToast.error).toHaveBeenCalledWith(
      'Completa primero el cuestionario inicial',
      expect.any(Object)
    )
    expect(api.updatePlan).not.toHaveBeenCalled()
  })

  it('llama a updatePlan si el plan ya existe', async () => {
    api.getUserPlans.mockResolvedValueOnce([{ idPlan: 99, idCuestionario: 555 }])
    const wrapper = mount(AdjustPlanView)
    await new Promise(resolve => setTimeout(resolve, 0))

    await wrapper.find('footer button').trigger('click')

    expect(api.updatePlan).toHaveBeenCalledWith(99, expect.objectContaining({
      idCuestionario: 555,
      pausasDiarias: 3
    }))
  })

  it('permite ajustar la hora y el minuto del ritual de descanso', async () => {
    const wrapper = mount(AdjustPlanView)
    await new Promise(resolve => setTimeout(resolve, 0))

    // Ritual de descanso section is the second .rounded-3xl
    const sections = wrapper.findAll('.rounded-3xl')
    const ritualSection = sections[1]
    
    const btns = ritualSection.findAll('button')
    // btns[0]: Hour Up, btns[1]: Hour Down, btns[2]: Minute Up, btns[3]: Minute Down
    
    await btns[0].trigger('click') 
    expect(wrapper.vm.hour).toBe(23)
    
    await btns[1].trigger('click') 
    expect(wrapper.vm.hour).toBe(22)

    await btns[2].trigger('click') 
    expect(wrapper.vm.minute).toBe(5)
  })

  it('crea un nuevo plan si no existe uno previo', async () => {
    api.getUserPlans.mockResolvedValueOnce([])
    const wrapper = mount(AdjustPlanView)
    await new Promise(resolve => setTimeout(resolve, 0))

    await wrapper.find('footer button').trigger('click')

    expect(api.createPersonalizedPlan).toHaveBeenCalled()
    expect(mockToast.success).toHaveBeenCalledWith('Plan creado correctamente', expect.any(Object))
  })
})