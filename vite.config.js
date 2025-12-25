import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://backend1-r00v25rf1-vinodpatelgroupteam.vercel.app',
        changeOrigin: true
      }
    }
  }
})

