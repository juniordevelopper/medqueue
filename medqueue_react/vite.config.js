import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Local tarmoqdagi qurilmalar (telefon) kirishi uchun
    port: 5173
  }
})
