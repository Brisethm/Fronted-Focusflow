import { flushPromises, mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProfileView from '../../views/ProfileView.vue'
import * as api from '../../services/api'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
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
  getProfile: vi.fn(),
  updateProfile: vi.fn(),
  updatePassword: vi.fn()
}))

describe('ProfileView.vue', () => {
  const mockUser = {
    nombre: 'Briseth Sofía',
    email: 'briseth@test.com',
    rol: 'usuario',
    edad: 25
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    api.getProfile.mockResolvedValue(mockUser)
  })

  it('carga y muestra la información del perfil al iniciar', async () => {
    const wrapper = mount(ProfileView)
    
    await flushPromises()

    expect(wrapper.find('[data-testid="user-name-display"]').text()).toBe('Briseth Sofía')
    expect(wrapper.find('[data-testid="user-email-display"]').text()).toBe('briseth@test.com')
  })

  it('cambia a modo edición y permite guardar cambios', async () => {
    const wrapper = mount(ProfileView)
    await flushPromises()

    await wrapper.find('[data-testid="btn-toggle-edit"]').trigger('click')
    expect(wrapper.find('[data-testid="edit-profile-form"]').exists()).toBe(true)

    const input = wrapper.find('[data-testid="input-nombre"]')
    await input.setValue('Nuevo Nombre')

    api.updateProfile.mockResolvedValueOnce({ ...mockUser, nombre: 'Nuevo Nombre' })
    
    await wrapper.find('[data-testid="btn-save-edit"]').trigger('click')

    expect(api.updateProfile).toHaveBeenCalledWith(expect.objectContaining({
      nombre: 'Nuevo Nombre'
    }))
    expect(mockToast.success).toHaveBeenCalledWith('Perfil actualizado correctamente.')
  })

  it('realiza el cierre de sesión correctamente', async () => {
    localStorage.setItem('token', 'valid-token')
    localStorage.setItem('refreshToken', 'valid-refresh')
    
    const wrapper = mount(ProfileView)
    await flushPromises()

    await wrapper.find('[data-testid="btn-logout"]').trigger('click')

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('refreshToken')).toBeNull()
    expect(mockPush).toHaveBeenCalledWith('/login')
    expect(mockToast.info).toHaveBeenCalledWith('Has cerrado sesión correctamente.')
  })

  it('permite cambiar la contraseña', async () => {
    const wrapper = mount(ProfileView)
    await flushPromises()

    await wrapper.find('[data-testid="btn-toggle-password"]').trigger('click')
    expect(wrapper.find('[data-testid="change-password-form"]').exists()).toBe(true)

    await wrapper.find('[data-testid="input-new-password"]').setValue('newPassword123')
    await wrapper.find('[data-testid="input-confirm-password"]').setValue('newPassword123')

    api.updatePassword.mockResolvedValueOnce({})
    
    await wrapper.find('[data-testid="btn-save-password"]').trigger('click')

    expect(api.updatePassword).toHaveBeenCalledWith('newPassword123')
    expect(mockToast.success).toHaveBeenCalledWith('Contraseña actualizada con éxito.')
  })

  it('gestiona la activación de notificaciones', async () => {
    const mockRequestPermission = vi.fn().mockResolvedValue('granted')
    globalThis.Notification = {
      requestPermission: mockRequestPermission,
      permission: 'default'
    }

    const wrapper = mount(ProfileView)
    await flushPromises()
    await wrapper.find('[data-testid="btn-toggle-notifications"]').trigger('click')

    expect(mockRequestPermission).toHaveBeenCalled()
  })
})
