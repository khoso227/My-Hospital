// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,               // tumhara port 5174 hai
    proxy: {
      '/api': {
        target: 'http://localhost:5000',   // backend ka port
        changeOrigin: true,
        secure: false,
      }
    },
    hmr: {
      overlay: false          // yeh error overlay band karega (jo blank screen ka issue solve karega)
    }
  }
})