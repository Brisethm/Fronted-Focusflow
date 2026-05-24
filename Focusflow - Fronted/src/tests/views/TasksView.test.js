import { flushPromises, mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TasksView from '../../views/TasksView.vue'
import * as api from '../../services/api'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  }),
  useRoute: () => ({
    path: '/tasks'
  })
}))

vi.mock('../../services/api', () => ({
  getTasks: vi.fn(),
  deleteTask: vi.fn()
}))

describe('TasksView.vue', () => {
  const mockTasks = [
    { 
      idTarea: 101, 
      titulo: 'Tarea de Prueba', 
      fechaLimite: new Date().toISOString(),
      estado: 'Por Hacer',
      prioridad: 'Alta'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    api.getTasks.mockResolvedValue(mockTasks)
  })

  it('muestra la lista de tareas agrupadas por fecha', async () => {
    const wrapper = mount(TasksView)
    await flushPromises()

    expect(wrapper.text()).toContain('Tarea de Prueba')
    expect(wrapper.text()).toContain('Hoy') 
  })

  it('abre el modal de confirmación y elimina la tarea', async () => {
    const wrapper = mount(TasksView)
    await flushPromises()

    
    const deleteBtn = wrapper.findAll('button').find(b => b.text().includes('Eliminar'))
    await deleteBtn.trigger('click')

    expect(wrapper.text()).toContain('Tarea de Prueba')
    expect(wrapper.text()).toContain('Esta acción no se puede deshacer')

    
    const confirmBtn = wrapper.find('button.bg-red-600')
    await confirmBtn.trigger('click')

    expect(api.deleteTask).toHaveBeenCalledWith(101)
    
    expect(wrapper.text()).not.toContain('Tarea de Prueba')
  })
})
