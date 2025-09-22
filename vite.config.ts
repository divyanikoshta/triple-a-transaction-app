import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/accounts': {
        target: 'http://localhost:8860',
        changeOrigin: true,
      },
      '/transactions': {
        target: 'http://localhost:8860',
        changeOrigin: true,
      },
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['node_modules/', 'dist/', 'coverage/', '**/*.d.ts', '**/*.js', 'vite.config.ts',
        'src/main.tsx',
        'src/App.tsx',
        'src/store.ts', 'src/services/**', 'src/redux-store/account/accountSlice.ts'],
    },
  },
})
