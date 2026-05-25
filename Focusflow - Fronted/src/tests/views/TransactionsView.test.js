import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TransactionsView from '../../views/TransactionsView.vue'
import * as api from '../../services/api'

// Mocks de dependencias
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

vi.mock('../../stores/locale', () => ({
  t: vi.fn((key) => key),
  localeCode: { value: 'es-CO' }
}))

vi.mock('../../services/api', () => ({
  getTransacciones: vi.fn(),
  deleteTransaccion: vi.fn(),
  createTransaccion: vi.fn(),
  getTransaccionById: vi.fn(),
  updateTransaccion: vi.fn()
}))

vi.mock('../../components/FooterNav.vue', () => ({
  default: { template: '<div>Footer</div>' }
}))

describe('TransactionsView.vue', () => {
  const mockTransacciones = [
    { idTransaccion: 1, monto: 1000, tipo: 'Ingreso', categoria: 'Venta', fecha: '2023-10-10T10:00:00Z' },
    { idTransaccion: 2, monto: 500, tipo: 'Gasto', categoria: 'Comida', fecha: '2023-10-10T11:00:00Z' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    api.getTransacciones.mockResolvedValue(mockTransacciones)
    globalThis.alert = vi.fn()
    globalThis.confirm = vi.fn(() => true)
  })

  it('renderiza el resumen y calcula el balance total correctamente', async () => {
    const wrapper = mount(TransactionsView)
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('transactions.summary')
    // Balance: 1000 - 500 = 500
    expect(wrapper.text()).toContain('$500')
    expect(wrapper.text()).toContain('$1.000') // Incomes
    expect(wrapper.text()).toContain('$500') // Expenses
  })

  it('lista las transacciones obtenidas de la API', async () => {
    const wrapper = mount(TransactionsView)
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.findAll('.transaction-row').length).toBe(2)
    expect(wrapper.text()).toContain('Venta')
    expect(wrapper.text()).toContain('Comida')
  })

  it('abre el modal y crea una transacción exitosamente', async () => {
    const wrapper = mount(TransactionsView)
    await wrapper.find('.add-transaction-button').trigger('click')

    await wrapper.find('.amount-input').setValue(200)
    await wrapper.find('.row-input[type="text"]').setValue('Transporte')
    
    api.createTransaccion.mockResolvedValueOnce({ idTransaccion: 3 })
    
    await wrapper.find('form.transaction-form').trigger('submit.prevent')

    expect(api.createTransaccion).toHaveBeenCalledWith(expect.objectContaining({
      monto: 200,
      categoria: 'Transporte'
    }))
  })

  it('carga datos en el formulario al entrar en modo edición', async () => {
    const wrapper = mount(TransactionsView)
    await new Promise(resolve => setTimeout(resolve, 0))

    api.getTransaccionById.mockResolvedValueOnce(mockTransacciones[0])
    
    await wrapper.find('.edit-button').trigger('click')
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.find('.transaction-form-modal').exists()).toBe(true)
    expect(wrapper.vm.isEditing).toBe(true)
    expect(wrapper.vm.monto).toBe(1000)
  })

  it('valida campos obligatorios y muestra alerta', async () => {
    const wrapper = mount(TransactionsView)
    await wrapper.find('.add-transaction-button').trigger('click')

    // Intenta guardar con campos vacíos
    await wrapper.find('form.transaction-form').trigger('submit.prevent')

    expect(globalThis.alert).toHaveBeenCalledWith('transactions.completeFields')
    expect(api.createTransaccion).not.toHaveBeenCalled()
  })
})
