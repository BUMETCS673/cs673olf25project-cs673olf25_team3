import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: process.env.VITE_ALLOWED_HOSTS ? process.env.VITE_ALLOWED_HOSTS.split(',') : [],
  },
  test: {
    globals: true, // Enables global test APIs without imports
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // Path to your test setup file
  },
})
