import type { Plugin } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env = { ...process.env, ...env, PORT: '3001' }

  return {
    server: { port: 3001 },
    define: { 'process.env': JSON.stringify(process.env) },
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), removeUseClient()],
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
