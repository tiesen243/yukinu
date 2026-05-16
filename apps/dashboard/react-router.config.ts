import type { Config } from '@react-router/dev/config'

import { vercelPreset } from '@vercel/react-router/vite'

export default {
  appDirectory: 'src',
  ssr: true,
  future: {
    v8_viteEnvironmentApi: true,
    v8_passThroughRequests: true,
    v8_splitRouteModules: true,
    v8_middleware: true,
  },

  ...(process.env.VERCEL ? { presets: [vercelPreset()] } : {}),
} satisfies Config
