import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://backend1-ij7ii715e-vinodpatelgroupteam.vercel.app',
        changeOrigin: true
      }
    }
  }
})

