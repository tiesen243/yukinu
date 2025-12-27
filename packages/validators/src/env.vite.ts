import { createEnv } from '@yukinu/lib/create-env'
import * as z from 'zod/mini'

export const env = createEnv({
  server: {},

  clientPrefix: 'VITE_',
  client: {
    // Application settings
    VITE_APP_NAME: z._default(z.string(), 'My App'),
    VITE_WEB_URL: z.optional(z.string()),
    VITE_DASHBOARD_URL: z.optional(z.string()),
    VITE_TRPC_USE_STREAMING: z._default(z.enum(['true', 'false']), 'true'),
  },

  runtimeEnv: {
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_WEB_URL: import.meta.env.VITE_WEB_URL,
    VITE_DASHBOARD_URL: import.meta.env.VITE_DASHBOARD_URL,
    VITE_TRPC_USE_STREAMING: import.meta.env.VITE_TRPC_USE_STREAMING,
  },

  skipValidation: true,
})

declare global {
  interface ImportMeta {
    readonly env: Record<string, string | undefined>
  }
}
