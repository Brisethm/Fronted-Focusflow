import { flushPromises, mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TicketsView from '../../views/TicketsView.vue' // Asegúrate de importar el componente real
import * as api from '../../services/api'

// Mock de Vue Router
vi.mock('vue-router', () => ({
  useRouter: () => ({ back: vi.fn() })
}))

// Mock de API Corregido
vi.mock('../../services/api', () => ({
  getAllTickets: vi.fn()
}))

vi.mock('vue-toastification', () => ({
  useToast: () => ({ error: vi.fn(), success: vi.fn() })
}))

describe('TicketsView.vue', () => {
  const mockTickets = [
    { 
      idTicket: 101, 
      asunto: 'Error de Prueba', 
      fechaCreacion: '2023-10-15T10:00:00Z',
      estado: 'open',
      categoria: 'technical',
      prioridad: 'high',
      descripcion: 'Detalle'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    api.getAllTickets.mockResolvedValue(mockTickets)
  })

  it('muestra la lista de tickets cargados', async () => {
    const wrapper = mount(TicketsView)
    await flushPromises()

    expect(wrapper.text()).toContain('Error de Prueba')
    expect(api.getAllTickets).toHaveBeenCalled()
  })

  it('permite filtrar por prioridad', async () => {
    const wrapper = mount(TicketsView)
    await flushPromises()

    await wrapper.find('button.bg-primary').trigger('click')
    
    const filterAlta = wrapper.findAll('button').find(b => b.text().includes('Alta'))
    await filterAlta.trigger('click')

    expect(wrapper.vm.filterPriority).toBe('high')
    expect(wrapper.vm.visibleTickets.length).toBe(1)
  })
})