import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

import path from 'node:path'

export default defineConfig({
  // base: mode === 'development' ? '/dashboard' : '/',
  plugins: [reactRouter(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  // build: {
  // assetsDir: 'dashboard/assets',
  // },
})
