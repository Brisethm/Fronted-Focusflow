import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
  ],

  build: {
    rollupOptions: {
      onLog(level, log, handler) {
        if (
          log.code === 'INVALID_ANNOTATION' &&
          log.id?.includes('@microsoft/signalr')
        ) {
          return
        }

        handler(level, log)
      },
      onwarn(warning, handler) {
        if (
          warning.code === 'INVALID_ANNOTATION' &&
          warning.id?.includes('@microsoft/signalr')
        ) {
          return
        }

        handler(warning)
      },
    },
  },

  resolve: {
    alias: {
      '@': fileURLToPath(
        new URL('./src', import.meta.url)
      )
    }
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      all: true,
      include: ['src/**/*.{js,vue}'],
      exclude: [
        'src/tests/**',
        'src/main.js',
        'src/router/**',
        '**/*.config.*',
      ],
    }
  }
})
