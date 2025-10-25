import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/dashboard/' : '/',
  define: {
    'process.env': JSON.stringify({
      ...process.env,
      ...loadEnv(mode, process.cwd(), ''),
    }),
  },
  plugins: [reactRouter(), tailwindcss(), tsconfigPaths()],
  ...(mode === 'production'
    ? { resolve: { alias: { 'react-dom/server': 'react-dom/server.node' } } }
    : {}),
}))
