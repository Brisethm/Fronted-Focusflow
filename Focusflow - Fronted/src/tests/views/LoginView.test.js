import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginView from '../../views/LoginView.vue'
import * as api from '../../services/api'

const mockPush = vi.fn()

vi.mock('vue-toastification', () => ({
  useToast: () => ({
    error: vi.fn()
  })
}))

vi.mock('../../services/api', () => ({
  login: vi.fn(),
  getProfile: vi.fn()
}))

describe('LoginView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mountComponent = () => {
    return mount(LoginView, {
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' }
        },
        mocks: {
          $router: { push: mockPush }
        }
      }
    })
  }

  it('valida el formulario y muestra errores si los campos están vacíos', async () => {
    const wrapper = mountComponent()
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('El correo es obligatorio')
    expect(wrapper.text()).toContain('La contraseña es obligatoria')
    expect(api.login).not.toHaveBeenCalled()
  })

  it('valida el formato del correo electrónico al perder el foco', async () => {
    const wrapper = mountComponent()
    const emailInput = wrapper.find('#email')
    
    await emailInput.setValue('usuario-invalido')
    await emailInput.trigger('blur')
    
    expect(wrapper.text()).toContain("Debe incluir un '@'")
  })

  it('permite alternar la visibilidad de la contraseña', async () => {
    const wrapper = mountComponent()
    const passwordInput = wrapper.find('#password')
    const toggleBtn = wrapper.find('button[type="button"]')

    expect(passwordInput.attributes('type')).toBe('password')
    await toggleBtn.trigger('click')
    expect(passwordInput.attributes('type')).toBe('text')
    await toggleBtn.trigger('click')
    expect(passwordInput.attributes('type')).toBe('password')
  })

  it('inicia sesión exitosamente y redirige según el rol (admin)', async () => {
    api.login.mockResolvedValueOnce({ token: 'token-admin' })
    api.getProfile.mockResolvedValueOnce({ rol: 'admin' })

    const wrapper = mountComponent()
    await wrapper.find('#email').setValue('admin@test.com')
    await wrapper.find('#password').setValue('admin123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(api.login).toHaveBeenCalledWith('admin@test.com', 'admin123', false)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(mockPush).toHaveBeenCalledWith('/admin-panel')
  })

  it('redirige a /dashboard para usuarios con rol estándar', async () => {
    api.login.mockResolvedValueOnce({ token: 'token-user' })
    api.getProfile.mockResolvedValueOnce({ rol: 'usuario' })

    const wrapper = mountComponent()
    await wrapper.find('#email').setValue('user@test.com')
    await wrapper.find('#password').setValue('user123')
    await wrapper.find('form').trigger('submit.prevent')

    await new Promise(resolve => setTimeout(resolve, 0))
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })

  it('redirige a /support-dashboard para personal de soporte', async () => {
    api.login.mockResolvedValueOnce({ token: 'token-support' })
    api.getProfile.mockResolvedValueOnce({ rol: 'support' })

    const wrapper = mountComponent()
    await wrapper.find('#email').setValue('support@test.com')
    await wrapper.find('#password').setValue('support123')
    await wrapper.find('form').trigger('submit.prevent')

    await new Promise(resolve => setTimeout(resolve, 0))
    expect(mockPush).toHaveBeenCalledWith('/support-dashboard')
  })

  it('envía el valor de rememberMe correctamente si está marcado', async () => {
    const wrapper = mountComponent()
    await wrapper.find('#rememberMe').setValue(true)
    await wrapper.find('#email').setValue('user@test.com')
    await wrapper.find('#password').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(api.login).toHaveBeenCalledWith('user@test.com', 'password123', true)
  })
})