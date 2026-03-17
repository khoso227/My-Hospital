// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    // Ye proxy setting backend calls ko forward karegi
    proxy: {
      // Sab /api/... wale requests ko backend (port 5000) pe bhej dega
      '/api': {
        target: 'http://localhost:5000',   // ← aapka backend port
        changeOrigin: true,                // host header change karega
        secure: false,                     // local dev ke liye
        rewrite: (path) => path.replace(/^\/api/, ''), // optional agar backend /api pe expect nahi karta
      },
    },
  },
})