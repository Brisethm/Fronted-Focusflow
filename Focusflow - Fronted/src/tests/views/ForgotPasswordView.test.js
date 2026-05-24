import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import ForgotPasswordView from '../../views/ForgotPasswordView.vue'
import * as api from '../../services/api'

const mockToast = {
  success: vi.fn(),
  error: vi.fn()
}
vi.mock('vue-toastification', () => ({
  useToast: () => mockToast
}))

vi.mock('../../services/api', () => ({
  resetPassword: vi.fn()
}))

vi.mock('vue-router', () => ({
  RouterLink: {
    template: '<a><slot /></a>'
  }
}))

describe('ForgotPasswordView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renderiza el título y el campo de email correctamente', () => {
    const wrapper = mount(ForgotPasswordView)
    expect(wrapper.find('h1').text()).toBe('Restablece tu contraseña')
    expect(wrapper.find('label[for="email"]').text()).toBe('Correo Electrónico')
    expect(wrapper.find('input#email').exists()).toBe(true)
  })

  it('muestra error si el correo está vacío al enviar', async () => {
    const wrapper = mount(ForgotPasswordView)
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.find('.text-red-500').text()).toBe('El correo es obligatorio')
    expect(api.resetPassword).not.toHaveBeenCalled()
  })

  it('valida que el correo no contenga espacios', async () => {
    const wrapper = mount(ForgotPasswordView)
    const input = wrapper.find('input#email')
    
    await input.setValue('test @example.com')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.find('.text-red-500').text()).toBe('El correo no debe contener espacios')
  })

  it('valida el formato de correo electrónico', async () => {
    const wrapper = mount(ForgotPasswordView)
    const input = wrapper.find('input#email')
    
    await input.setValue('usuarioexample.com')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.find('.text-red-500').text()).toBe("Debe incluir un '@'")
    
    await input.setValue('usuario@example')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.find('.text-red-500').text()).toBe('Ejemplo válido: usuario@correo.com')
  })

  it('envía el formulario correctamente e inicia el temporizador de reenvío', async () => {
    api.resetPassword.mockResolvedValueOnce({ data: 'Enlace enviado' })
    const wrapper = mount(ForgotPasswordView)
    
    await wrapper.find('input#email').setValue('user@focusflow.com')
    await wrapper.find('form').trigger('submit.prevent')

    expect(api.resetPassword).toHaveBeenCalledWith('user@focusflow.com')
    
    await vi.waitFor(() => expect(wrapper.vm.loading).toBe(false))
    
    expect(mockToast.success).toHaveBeenCalled()
    expect(wrapper.find('button[type="submit"]').text()).toContain('Reenviar en 60s')
    expect(wrapper.find('button[type="submit"]').element.disabled).toBe(true)

    vi.advanceTimersByTime(1000)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button[type="submit"]').text()).toContain('Reenviar en 59s')
  })

  it('maneja errores de la API al enviar el correo', async () => {
    api.resetPassword.mockRejectedValueOnce({ response: { data: 'Email no encontrado' } })
    const wrapper = mount(ForgotPasswordView)
    
    await wrapper.find('input#email').setValue('error@focusflow.com')
    await wrapper.find('form').trigger('submit.prevent')
    
    await vi.waitFor(() => expect(wrapper.vm.loading).toBe(false))
    expect(mockToast.error).toHaveBeenCalledWith(expect.stringContaining('Email no encontrado'), expect.any(Object))
  })
})