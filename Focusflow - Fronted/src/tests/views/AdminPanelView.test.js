import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminPanelView from '../../views/AdminPanelView.vue'
import * as api from '../../services/api'

const mockPush = vi.fn()
const mockToast = {
  error: vi.fn()
}

vi.mock('vue-toastification', () => ({
  useToast: () => mockToast
}))

vi.mock('../../services/api', () => ({
  getProfile: vi.fn()
}))

describe('AdminPanelView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  const mountComponent = () => {
    return mount(AdminPanelView, {
      global: {
        mocks: {
          $router: { push: mockPush }
        }
      }
    })
  }

  it('carga el perfil del administrador al montar y muestra el nombre', async () => {
    api.getProfile.mockResolvedValue({ nombre: 'Admin User', rol: 'admin' })
    const wrapper = mountComponent()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('Hola, Admin 👋')
    expect(api.getProfile).toHaveBeenCalled()
  })

  it('permite el acceso a registro de staff si el rol es administrador', async () => {
    api.getProfile.mockResolvedValue({ nombre: 'Admin', rol: 'administrador' })
    const wrapper = mountComponent()
    await new Promise(resolve => setTimeout(resolve, 0))

    const cards = wrapper.findAll('.card')
    await cards[2].trigger('click')

    expect(mockPush).toHaveBeenCalledWith('/register-staff')
  })

  it('deniega acceso y muestra error si un usuario no admin intenta registrar staff', async () => {
    api.getProfile.mockResolvedValue({ nombre: 'Support', rol: 'support' })
    const wrapper = mountComponent()
    await new Promise(resolve => setTimeout(resolve, 0))

    const cards = wrapper.findAll('.card')
    await cards[2].trigger('click')

    expect(mockToast.error).toHaveBeenCalledWith('No tienes permisos para registrar staff.')
    expect(mockPush).not.toHaveBeenCalledWith('/register-staff')
  })

  it('realiza el cierre de sesión eliminando tokens', async () => {
    localStorage.setItem('token', 'admin-token')
    api.getProfile.mockResolvedValue({ nombre: 'Admin', rol: 'admin' })
    const wrapper = mountComponent()
    
    await wrapper.find('button.text-red-500').trigger('click')

    expect(localStorage.getItem('token')).toBeNull()
    expect(mockPush).toHaveBeenCalledWith('/login')
  })
})