import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative base for GitHub Pages compatibility
  // If you know your repository name, you can set it like:
  // base: '/agro-app/',
})