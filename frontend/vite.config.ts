import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    port: 30000,

    proxy: {
      '/api': {
        target: 'http://backend:28000',
        changeOrigin: true
      }
    }
  }
})
