import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DashboardView from '../../views/DashboardView.vue'
import * as api from '../../services/api'
import * as localeStore from '../../stores/locale'


vi.mock('vue-router', () => ({
  RouterLink: { template: '<a><slot/></a>' }
}))

vi.mock('../../services/api', () => ({
  getTasks: vi.fn(),
  createEmotionalRecord: vi.fn()
}))

vi.mock('../../stores/locale', () => ({
  locale: { value: 'es' },
  localeCode: { value: 'es-CO' },
  setLocale: vi.fn(),
  t: vi.fn((key) => key),
  availableLanguages: [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' }
  ]
}))

vi.mock('../../components/FooterNav.vue', () => ({
  default: { template: '<nav>Footer</nav>' }
}))

describe('DashboardView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.getTasks.mockResolvedValue([])
  })

  it('renderiza el título y las secciones correctamente', async () => {
    const wrapper = mount(DashboardView)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(wrapper.find('.dashboard-heading-perpetua').text()).toBe('dashboard.title')
    expect(wrapper.text()).toContain('dashboard.howDoYouFeel')
  })

  it('carga tareas de hoy y calcula el progreso correctamente', async () => {
    const today = new Date().toISOString()
    api.getTasks.mockResolvedValue([
      { idTarea: 1, titulo: 'Tarea Hoy 1', fecha_limite: today, estado: 'Completado' },
      { idTarea: 2, titulo: 'Tarea Hoy 2', fecha_limite: today, estado: 'Por Hacer' },
      { idTarea: 3, titulo: 'Tarea Futura', fecha_limite: '2050-01-01T00:00:00Z', estado: 'Por Hacer' }
    ])

    const wrapper = mount(DashboardView)
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('Tarea Hoy 1')
    expect(wrapper.text()).toContain('Tarea Hoy 2')
    expect(wrapper.text()).not.toContain('Tarea Futura')
    
    
    expect(wrapper.find('.bg-primary').attributes('style')).toContain('width: 50%')
  })

  it('abre y cierra el menú de idiomas', async () => {
    const wrapper = mount(DashboardView)
    const toggleBtn = wrapper.find('button[aria-label="actions.changeLanguage"]')
    
    await toggleBtn.trigger('click')
    expect(wrapper.find('.w-40').exists()).toBe(true)
    
    await toggleBtn.trigger('click')
    expect(wrapper.find('.w-40').exists()).toBe(false)
  })

  it('llama a setLocale al seleccionar un idioma', async () => {
    const wrapper = mount(DashboardView)
    await wrapper.find('button[aria-label="actions.changeLanguage"]').trigger('click')
    const esBtn = wrapper.findAll('.w-40 button').find(b => b.text() === 'Español')
    await esBtn.trigger('click')
    expect(localeStore.setLocale).toHaveBeenCalledWith('es')
  })

  it('guarda el registro emocional y activa el temporizador de cooldown', async () => {
    vi.useFakeTimers()
    api.createEmotionalRecord.mockResolvedValue({ success: true })
    const wrapper = mount(DashboardView)

    await wrapper.find('form').trigger('submit')
    
    expect(api.createEmotionalRecord).toHaveBeenCalled()
    expect(wrapper.text()).toContain('dashboard.saveTimer')
    
    vi.useRealTimers()
  })

  it('muestra mensaje de error si la API de registro emocional falla', async () => {
    api.createEmotionalRecord.mockRejectedValue(new Error('Fail'))
    const wrapper = mount(DashboardView)
    
    await wrapper.find('form').trigger('submit')
    await new Promise(resolve => setTimeout(resolve, 0))
    
    expect(wrapper.text()).toContain('dashboard.saveError')
  })

  it('calcula correctamente el estilo de la barra de energía', async () => {
    const wrapper = mount(DashboardView)
    
    // Energía inicial 3. (3-1)/4 * 100 = 50%
    expect(wrapper.vm.energyTrackStyle.background).toContain('50%')
    
    await wrapper.setData({ energy: 5 })
    // (5-1)/4 * 100 = 100%
    expect(wrapper.vm.energyTrackStyle.background).toContain('100%')
  })
})