import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import FocusView from '../../views/FocusView.vue'
import * as api from '../../services/api'


vi.mock('../../stores/locale', () => ({
  t: vi.fn((key) => key)
}))


vi.mock('../../services/api', () => ({
  getTasks: vi.fn(),
  createFocusSession: vi.fn()
}))


vi.mock('../components/FooterNav.vue', () => ({
  default: { template: '<div>Footer</div>' }
}))

vi.mock('../../components/FooterNav.vue', () => ({
  default: { template: '<div>Footer</div>' }
}))

describe('FocusView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.getTasks.mockResolvedValue([])
    api.createFocusSession.mockResolvedValue({})
    
    
    global.Audio = vi.fn(function () {
      return {
        play: vi.fn().mockResolvedValue()
      }
    })

    
    global.confirm = vi.fn(() => true)
    
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('inicializa con el modo Timeboxing y el tiempo por defecto (45 min)', () => {
    const wrapper = mount(FocusView)
    expect(wrapper.find('.mode-pill.active').text()).toBe('focus.mode.timeboxing')
    expect(wrapper.find('.timer-digits').text()).toBe('45:00')
  })

  it('cambia entre modos y actualiza el tiempo base', async () => {
    const wrapper = mount(FocusView)
    const pills = wrapper.findAll('.mode-pill')
    
    
    await pills.find(p => p.text() === 'focus.mode.pomodoro').trigger('click')
    expect(wrapper.find('.timer-digits').text()).toBe('25:00')
    
    
    await pills.find(p => p.text() === 'focus.mode.descanso').trigger('click')
    expect(wrapper.find('.timer-digits').text()).toBe('05:00')
  })

  it('solicita confirmación al cambiar de modo si hay una sesión activa', async () => {
    const wrapper = mount(FocusView)
    
    
    await wrapper.find('.btn-main').trigger('click')
    vi.advanceTimersByTime(1000) 
    
    const pills = wrapper.findAll('.mode-pill')
    await pills.find(p => p.text() === 'focus.mode.pomodoro').trigger('click')
    
    expect(global.confirm).toHaveBeenCalled()
  })

  it('gestiona correctamente los estados de Play, Pausa y Reanudar', async () => {
    const wrapper = mount(FocusView)
    const startBtn = wrapper.find('.btn-main')
    
    expect(startBtn.text()).toContain('focus.startSession')
    
    
    await startBtn.trigger('click')
    expect(startBtn.text()).toContain('focus.pause')
    
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.timer-digits').text()).toBe('44:58')
    
    
    await startBtn.trigger('click')
    expect(startBtn.text()).toContain('focus.resume')
    
    vi.advanceTimersByTime(5000)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.timer-digits').text()).toBe('44:58') 
  })

  it('restablece el cronómetro al estado inicial mediante handleReset', async () => {
    const wrapper = mount(FocusView)
    await wrapper.find('.btn-main').trigger('click')
    vi.advanceTimersByTime(60000) 
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.timer-digits').text()).toBe('44:00')
    
    await wrapper.find('.btn-ghost.btn-icon').trigger('click')
    expect(wrapper.find('.timer-digits').text()).toBe('45:00')
    expect(wrapper.find('.btn-main').text()).toContain('focus.startSession')
  })

  it('permite ajustar el tiempo personalizado a través del modal', async () => {
    const wrapper = mount(FocusView)
    
    
    const adjustBtn = wrapper.findAll('.action-row').find(b => b.text().includes('focus.adjustTime'))
    await adjustBtn.trigger('click')
    
    
    const preset60 = wrapper.findAll('.preset-btn').find(b => b.text() === '60m')
    await preset60.trigger('click')
    
    
    await wrapper.find('.btn-full').trigger('click')
    expect(wrapper.find('.timer-digits').text()).toBe('60:00')
  })

  it('guarda la sesión y cambia a descanso automáticamente al terminar el tiempo', async () => {
    const wrapper = mount(FocusView)
    await wrapper.find('.btn-main').trigger('click')
    
    
    vi.advanceTimersByTime(45 * 60 * 1000)
    await wrapper.vm.$nextTick()
    
    expect(api.createFocusSession).toHaveBeenCalledWith(expect.objectContaining({
      tipo: 'Timeboxing',
      duracionMinutos: 45
    }))
    expect(wrapper.find('.mode-pill.active').text()).toBe('focus.mode.descanso')
  })
})
