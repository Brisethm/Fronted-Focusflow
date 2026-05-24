import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import UpdatePasswordView from '../../views/UpdatePasswordView.vue'

// Mocking Supabase Client (initialized at module level in the component)
const mockUpdateUser = vi.hoisted(() => vi.fn())
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      updateUser: mockUpdateUser
    }
  }))
}))

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
  }),
  RouterLink: { template: '<a><slot /></a>' }
}))

const mockToast = {
  success: vi.fn(),
  error: vi.fn()
}
vi.mock('vue-toastification', () => ({
  useToast: () => mockToast
}))

describe('UpdatePasswordView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debe renderizar correctamente los campos de entrada', () => {
    const wrapper = mount(UpdatePasswordView)
    expect(wrapper.find('h1').text()).toBe('Crea una nueva contraseña')
    expect(wrapper.find('#password').exists()).toBe(true)
    expect(wrapper.find('#confirmPassword').exists()).toBe(true)
  })

  it('debe alternar la visibilidad de la contraseña al hacer clic en el ojo', async () => {
    const wrapper = mount(UpdatePasswordView)
    const passwordInput = wrapper.find('#password')
    const toggleBtn = wrapper.findAll('button[type="button"]')[0]

    expect(passwordInput.attributes('type')).toBe('password')
    await toggleBtn.trigger('click')
    expect(passwordInput.attributes('type')).toBe('text')
  })

  it('debe mostrar error si la contraseña no cumple con los requisitos de seguridad', async () => {
    const wrapper = mount(UpdatePasswordView)
    const passwordInput = wrapper.find('#password')
    
    // Contraseña sin números ni mayúsculas
    await passwordInput.setValue('solo-letras')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.text()).toContain('Debe tener 8-20 caracteres, mayúscula, minúscula y un número')
    expect(mockUpdateUser).not.toHaveBeenCalled()
  })

  it('debe validar que las contraseñas coincidan', async () => {
    const wrapper = mount(UpdatePasswordView)
    
    await wrapper.find('#password').setValue('SecurePass123')
    await wrapper.find('#confirmPassword').setValue('DifferentPass123')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.text()).toContain('Las contraseñas no coinciden')
  })

  it('debe llamar a supabase.auth.updateUser y redirigir al login tras éxito', async () => {
    mockUpdateUser.mockResolvedValueOnce({ data: {}, error: null })
    const wrapper = mount(UpdatePasswordView)
    
    await wrapper.find('#password').setValue('SecurePass123')
    await wrapper.find('#confirmPassword').setValue('SecurePass123')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(mockUpdateUser).toHaveBeenCalledWith({ password: 'SecurePass123' })
    expect(mockToast.success).toHaveBeenCalledWith('Contraseña actualizada correctamente', expect.any(Object))
    
    vi.advanceTimersByTime(2000)
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('debe manejar errores devueltos por la API de Supabase', async () => {
    mockUpdateUser.mockResolvedValueOnce({ data: null, error: { message: 'El enlace ha expirado' } })
    const wrapper = mount(UpdatePasswordView)
    
    await wrapper.find('#password').setValue('SecurePass123')
    await wrapper.find('#confirmPassword').setValue('SecurePass123')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(mockToast.error).toHaveBeenCalledWith('Error: El enlace ha expirado', expect.any(Object))
  })
})
