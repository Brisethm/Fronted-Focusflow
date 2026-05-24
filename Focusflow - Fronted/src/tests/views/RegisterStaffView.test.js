import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RegisterStaffView from '../../views/RegisterStaffView.vue'
import * as api from '../../services/api'

const mockBack = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    back: mockBack,
    push: vi.fn()
  })
}))

const mockToast = {
  success: vi.fn(),
  error: vi.fn()
}
vi.mock('vue-toastification', () => ({
  useToast: () => mockToast
}))

vi.mock('../../services/api', () => ({
  registerStaff: vi.fn()
}))

vi.mock('../../stores/locale', () => ({
  t: vi.fn((key) => key)
}))

describe('RegisterStaffView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza el título y los campos del formulario correctamente', () => {
    const wrapper = mount(RegisterStaffView)
    expect(wrapper.text()).toContain('registerStaff.title')
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('select').exists()).toBe(true)
  })

  it('permite alternar la visibilidad de la contraseña', async () => {
    const wrapper = mount(RegisterStaffView)
    // Buscamos el input por su placeholder traducido (mocked key)
    const passwordInput = wrapper.find('input[required][placeholder="registerStaff.tempPassword"]')
    const toggleBtn = wrapper.find('button[type="button"]')

    expect(passwordInput.attributes('type')).toBe('password')
    await toggleBtn.trigger('click')
    expect(passwordInput.attributes('type')).toBe('text')
    await toggleBtn.trigger('click')
    expect(passwordInput.attributes('type')).toBe('password')
  })

  it('deshabilita el botón de envío si la contraseña es menor a 8 caracteres', async () => {
    const wrapper = mount(RegisterStaffView)
    const submitBtn = wrapper.find('button[type="submit"]')
    
    await wrapper.find('input[type="password"]').setValue('123')
    expect(submitBtn.element.disabled).toBe(true)
    
    await wrapper.find('input[type="password"]').setValue('password123')
    expect(submitBtn.element.disabled).toBe(false)
  })

  it('registra staff exitosamente y limpia el formulario', async () => {
    api.registerStaff.mockResolvedValueOnce({ data: { success: true } })
    const wrapper = mount(RegisterStaffView)
    
    // Rellenar formulario
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('Sofía Staff') // Nombre
    await inputs[1].setValue('sofia@focusflow.com') // Email
    await inputs[2].setValue('securePass123') // Password
    await wrapper.find('select').setValue('support')
    
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(api.registerStaff).toHaveBeenCalledWith(
      'sofia@focusflow.com',
      'securePass123',
      'Sofía Staff',
      'support'
    )
    
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(mockToast.success).toHaveBeenCalledWith('¡Éxito! Sofía Staff ha sido registrado.')
    
    // Verificar que el formulario se haya limpiado internamente
    expect(wrapper.vm.form.nombre).toBe('')
    expect(wrapper.vm.form.email).toBe('')
  })

  it('muestra un mensaje de error si el registro falla', async () => {
    const errorMessage = 'El correo ya está en uso'
    api.registerStaff.mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    })
    
    const wrapper = mount(RegisterStaffView)
    await wrapper.find('input[type="password"]').setValue('validPassword')
    await wrapper.find('form').trigger('submit.prevent')
    
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(mockToast.error).toHaveBeenCalledWith(errorMessage)
  })

  it('navega hacia atrás al hacer clic en el botón de regresar', async () => {
    const wrapper = mount(RegisterStaffView)
    const backBtn = wrapper.find('button.inline-flex')
    
    await backBtn.trigger('click')
    
    expect(mockBack).toHaveBeenCalled()
  })
})