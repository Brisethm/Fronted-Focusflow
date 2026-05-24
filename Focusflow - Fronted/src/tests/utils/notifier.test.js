import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { scheduleNotification } from '../../utils/notifier'

describe('notifier.js', () => {
  beforeEach(() => {
    // Configuramos timers falsos para controlar el paso del tiempo
    vi.useFakeTimers()
    
    // Mock de la clase Notification global
    const MockNotification = vi.fn()
    MockNotification.permission = 'default'
    vi.stubGlobal('Notification', MockNotification)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('debe programar una notificación y llamar al callback si el tiempo es futuro', () => {
    Notification.permission = 'granted'
    const callback = vi.fn()
    const delay = 5000 // 5 segundos en el futuro
    const futureDate = new Date(Date.now() + delay).toISOString()
    
    const rec = { mensaje: 'Tarea pendiente', fechaHora: futureDate, id: 101 }

    scheduleNotification(rec, callback)

    // El constructor no debe haberse llamado aún
    expect(Notification).not.toHaveBeenCalled()

    // Avanzamos el tiempo
    vi.advanceTimersByTime(delay)

    expect(Notification).toHaveBeenCalledWith('FocusFlow', {
      body: 'Tarea pendiente',
      icon: '/icon.svg',
    })
    expect(callback).toHaveBeenCalledWith(101)
  })

  it('no debe programar nada si la fecha es pasada', () => {
    const callback = vi.fn()
    const pastDate = new Date(Date.now() - 10000).toISOString() // 10s en el pasado
    const rec = { mensaje: 'Viejo', fechaHora: pastDate, id: 102 }

    scheduleNotification(rec, callback)
    vi.advanceTimersByTime(20000)

    expect(Notification).not.toHaveBeenCalled()
    expect(callback).not.toHaveBeenCalled()
  })

  it('debe llamar al callback incluso si el permiso es denegado, pero no mostrar notificación', () => {
    Notification.permission = 'denied'
    const callback = vi.fn()
    const delay = 1000
    const futureDate = new Date(Date.now() + delay).toISOString()
    const rec = { mensaje: 'Privacidad', fechaHora: futureDate, id: 103 }

    scheduleNotification(rec, callback)
    vi.advanceTimersByTime(delay)

    expect(Notification).not.toHaveBeenCalled()
    expect(callback).toHaveBeenCalledWith(103)
  })

  it('debe manejar correctamente el mapeo de snake_case (id_recordatorio y fecha_hora)', () => {
    Notification.permission = 'granted'
    const callback = vi.fn()
    const delay = 2000
    const futureDate = new Date(Date.now() + delay).toISOString()
    const rec = { mensaje: 'Snake Case', fecha_hora: futureDate, id_recordatorio: 500 }

    scheduleNotification(rec, callback)
    vi.advanceTimersByTime(delay)

    expect(callback).toHaveBeenCalledWith(500)
  })
})