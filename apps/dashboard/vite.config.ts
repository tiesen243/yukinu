import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  // base: mode === 'development' ? '/dashboard' : '/',
  plugins: [reactRouter(), tailwindcss()],
  resolve: { tsconfigPaths: true },
  // build: {
  // assetsDir: 'dashboard/assets',
  // },
})
