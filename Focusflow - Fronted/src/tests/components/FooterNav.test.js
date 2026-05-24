import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FooterNav from '../../components/FooterNav.vue'

const mockPush = vi.fn()
const mockRoute = { path: '/dashboard' }

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
  }),
  useRoute: () => mockRoute
}))

vi.mock('../../stores/locale', () => ({
  t: (key) => key
}))

describe('FooterNav.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute.path = '/dashboard'
  })

  it('renderiza todos los items de navegación', () => {
    const wrapper = mount(FooterNav)
    const items = wrapper.findAll('nav a')
    expect(items.length).toBe(5)
    expect(wrapper.text()).toContain('footerNav.home')
    expect(wrapper.text()).toContain('footerNav.tasks')
  })

  it('detecta correctamente la pestaña activa basada en la ruta actual', async () => {
    mockRoute.path = '/tasks'
    const wrapper = mount(FooterNav)
    
    const tasksItem = wrapper.findAll('nav a').find(a => a.attributes('href') === '/tasks')
    expect(tasksItem.attributes('aria-current')).toBe('page')
    expect(tasksItem.classes()).toContain('text-primary')
  })

  it('navega a la ruta correcta al hacer clic en un item', async () => {
    const wrapper = mount(FooterNav)
    const wellnessLink = wrapper.findAll('nav a').find(a => a.attributes('href') === '/wellness')
    
    await wellnessLink.trigger('click')
    
    expect(mockPush).toHaveBeenCalledWith('/wellness')
  })

  it('emite update:activeTab si la prop activeTab está presente', async () => {
    const wrapper = mount(FooterNav, {
      props: {
        activeTab: 'inicio'
      }
    })
    
    const tasksLink = wrapper.findAll('nav a').find(a => a.attributes('href') === '/tasks')
    await tasksLink.trigger('click')
    
    expect(wrapper.emitted('update:activeTab')[0]).toEqual(['tareas'])
  })
})