import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SupportDashboardView from '../../views/SupportDashboardView.vue'
import * as api from '../../services/api'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

vi.mock('../../services/api', () => ({
  getProfile: vi.fn()
}))

describe('SupportDashboardView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('carga el nombre del personal de soporte al montar', async () => {
    api.getProfile.mockResolvedValue({ nombre: 'Sofia Soporte' })
    const wrapper = mount(SupportDashboardView)
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('Hola, Sofia')
  })

  it('navega a las secciones correspondientes al hacer clic en las tarjetas', async () => {
    api.getProfile.mockResolvedValue({ nombre: 'Sofia' })
    const wrapper = mount(SupportDashboardView)

    const cards = wrapper.findAll('.card')

    await cards[0].trigger('click')
    expect(mockPush).toHaveBeenCalledWith('/dashboard')

    await cards[1].trigger('click')
    expect(mockPush).toHaveBeenCalledWith('/tickets')
  })

  it('realiza el cierre de sesion correctamente', async () => {
    localStorage.setItem('token', 'staff-token')
    api.getProfile.mockResolvedValue({ nombre: 'Sofia' })
    const wrapper = mount(SupportDashboardView)

    const logoutButton = wrapper.findAll('button').find(button => button.text().includes('Cerrar'))
    await logoutButton.trigger('click')

    expect(localStorage.getItem('token')).toBeNull()
    expect(mockPush).toHaveBeenCalledWith('/login')
  })
})
