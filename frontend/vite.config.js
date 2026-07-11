import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '127.0.0.1',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        // O backend monta as rotas em /auth, /user, /item... (sem o prefixo /api).
        // Removemos /api aqui para espelhar o comportamento do nginx em produção.
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
