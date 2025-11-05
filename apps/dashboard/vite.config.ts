import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }
  return {
    define: { 'process.env': JSON.stringify(env) },
    plugins: [reactRouter(), tailwindcss(), tsconfigPaths()],
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'SOURCEMAP_ERROR') return
          warn(warning)
        },
      },
    },
    ...(mode === 'production'
      ? { resolve: { alias: { 'react-dom/server': 'react-dom/server.node' } } }
      : {}),
  }
})
