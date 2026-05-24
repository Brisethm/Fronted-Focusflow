import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CreateTaskView from '../../views/CreateTaskView.vue'
import * as api from '../../services/api'

const mockPush = vi.fn()
const mockToast = {
  success: vi.fn(),
  error: vi.fn()
}

vi.mock('vue-toastification', () => ({
  useToast: () => mockToast
}))

vi.mock('../../services/api', () => ({
  createTask: vi.fn(),
  updateTask: vi.fn(),
  getRecordatorios: vi.fn(),
  createRecordatorio: vi.fn(),
  updateRecordatorio: vi.fn()
}))

describe('CreateTaskView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  const mountComponent = () => {
    return mount(CreateTaskView, {
      global: {
        mocks: {
          $router: { push: mockPush }
        }
      }
    })
  }

  it('valida campos obligatorios antes de enviar el formulario', async () => {
    const wrapper = mountComponent()
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.text()).toContain('Este campo es obligatorio')
    expect(api.createTask).not.toHaveBeenCalled()
  })

  it('crea una tarea exitosamente con datos válidos', async () => {
    api.createTask.mockResolvedValue({ idTarea: 1 })
    const wrapper = mountComponent()
    
    await wrapper.find('#task-name').setValue('Comprar pan')
    await wrapper.find('.priority-alta').trigger('click')
    await wrapper.find('.effort-bajo').trigger('click')
    await wrapper.find('#fecha-limite').setValue('2025-01-01T12:00')
    
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(api.createTask).toHaveBeenCalledWith(expect.objectContaining({
      titulo: 'Comprar pan',
      prioridad: 'alta'
    }))
    expect(mockToast.success).toHaveBeenCalledWith('Tarea generada con éxito', expect.any(Object))
    expect(mockPush).toHaveBeenCalledWith('/tasks')
  })

  it('permite seleccionar un icono emoji para la tarea', async () => {
    const wrapper = mountComponent()
    const emojiButtons = wrapper.findAll('.emoji-button')
    
    await emojiButtons[2].trigger('click') // Selecciona '🔥'
    
    expect(wrapper.find('.emoji-avatar').text()).toBe('🔥')
  })

  it('carga datos de tarea existente cuando está en modo edición', async () => {
    const mockTask = {
      idTarea: 50,
      titulo: 'Tarea Existente',
      prioridad: 'Media',
      nivelEsfuerzo: 'Bajo',
      estado: 'En Progreso'
    }
    sessionStorage.setItem('editingTask', JSON.stringify(mockTask))
    api.getRecordatorios.mockResolvedValue([])

    const wrapper = mountComponent()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.find('.card-title').text()).toBe('Editar Tarea')
    expect(wrapper.vm.task.nombre).toBe('Tarea Existente')
  })

  it('actualiza una tarea existente y su recordatorio', async () => {
    const mockTask = {
      idTarea: 50,
      titulo: 'Tarea Original',
      prioridad: 'Media',
      nivelEsfuerzo: 'Bajo',
      estado: 'En Progreso',
      fechaLimite: '2025-01-02T12:00:00Z',
      recordatorio: '2025-01-01T10:00:00Z'
    }
    sessionStorage.setItem('editingTask', JSON.stringify(mockTask))
    
    api.getRecordatorios.mockResolvedValueOnce([{
      idRecordatorio: 100,
      tipo: 'tarea',
      mensaje: 'Tarea Original',
      fechaHora: '2025-01-01T10:00:00Z'
    }])

    const wrapper = mountComponent()
    await new Promise(resolve => setTimeout(resolve, 0))

    await wrapper.find('#task-name').setValue('Tarea Actualizada')
    api.updateTask.mockResolvedValueOnce({})
    api.updateRecordatorio.mockResolvedValueOnce({ idRecordatorio: 100 })

    await wrapper.find('form').trigger('submit.prevent')

    expect(api.updateTask).toHaveBeenCalledWith(50, expect.objectContaining({
      titulo: 'Tarea Actualizada'
    }))
    expect(api.updateRecordatorio).toHaveBeenCalledWith(100, expect.any(Object))
    expect(mockToast.success).toHaveBeenCalledWith('Tarea actualizada con éxito', expect.any(Object))
  })
})
