import './src/lib/env'
import type { Config } from '@react-router/dev/config'

import { vercelPreset } from '@vercel/react-router/vite'

export default {
  appDirectory: 'src',
  ssr: true,
  future: {
    v8_viteEnvironmentApi: true,
  },

  ...(process.env.VERCEL ? { presets: [vercelPreset()] } : {}),
} satisfies Config
