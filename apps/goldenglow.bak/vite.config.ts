import type { Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env = { ...process.env, ...env, PORT: '3002' }

  return {
    server: { port: 3002 },
    define: { 'process.env': JSON.stringify(process.env) },
    plugins: [vue(), tailwindcss(), tsconfigPaths(), removeUseClient()],
  }
})

function removeUseClient(): Plugin {
  return {
    name: 'remove-use-client',
    transform(code, id) {
      if (/\.(js|ts|jsx|tsx)$/.test(id)) {
        const newCode = code.replace(/['"]use client['"];\s*/g, '')
        return { code: newCode }
      }
      return null
    },
  }
}
