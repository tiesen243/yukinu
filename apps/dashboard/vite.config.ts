import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  // base: mode === 'development' ? '/dashboard' : '/',
  plugins: [reactRouter(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  // build: {
  // assetsDir: 'dashboard/assets',
  // },
})
