import type { Config } from '@react-router/dev/config'
import { vercelPreset } from '@vercel/react-router/vite'

import { env } from '@yukinu/validators/env'

export default {
  appDirectory: 'src',
  basename: '/dashboard',
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  ...(env.VERCEL ? { presets: [vercelPreset()] } : {}),
} satisfies Config
