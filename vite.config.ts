import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use './' for relative paths so it works on any GitHub repo name
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})