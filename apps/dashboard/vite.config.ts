import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => ({
  define: {
    'process.env': JSON.stringify({
      ...process.env,
      ...loadEnv(mode, process.cwd(), ''),
    }),
  },
  plugins: [reactRouter(), tailwindcss(), tsconfigPaths(), removeUseClient()],
}))

function removeUseClient() {
  const filter = (id: string) =>
    id.endsWith('.ts') ||
    id.endsWith('.tsx') ||
    id.endsWith('.js') ||
    id.endsWith('.jsx')

  return {
    name: 'remove-use-client',

    transform(code: string, id: string) {
      if (!filter(id)) {
        return null
      }

      const newCode = code.replace(/['"]use client['"];\s*/g, '')

      return { code: newCode, map: null }
    },
  }
}
