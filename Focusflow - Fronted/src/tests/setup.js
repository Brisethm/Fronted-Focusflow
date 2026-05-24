import { config } from '@vue/test-utils'
import { afterEach, vi } from 'vitest'

config.global.stubs = {
  RouterLink: {
    props: ['to'],
    template: '<a :href="typeof to === \'string\' ? to : to?.path"><slot /></a>',
  },
  'router-link': {
    props: ['to'],
    template: '<a :href="typeof to === \'string\' ? to : to?.path"><slot /></a>',
  },
}

afterEach(() => {
  vi.unstubAllGlobals()
})
