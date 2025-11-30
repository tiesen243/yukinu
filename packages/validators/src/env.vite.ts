import * as z from 'zod/v4-mini'

import { createEnv } from '@/lib/create-env'

export const env = createEnv({
  server: {},

  clientPrefix: 'VITE_',
  client: {
    // Application settings
    VITE_APP_NAME: z._default(z.string(), 'My App'),
    VITE_APP_URL: z.optional(z.string()),
    VITE_TRPC_USE_STREAMING: z._default(z.enum(['true', 'false']), 'true'),
  },

  runtimeEnv: {
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_APP_URL: import.meta.env.VITE_APP_URL,
    VITE_TRPC_USE_STREAMING: import.meta.env.VITE_TRPC_USE_STREAMING,
  },

  skipValidation: true,
})

declare global {
  interface ImportMeta {
    readonly env: Record<string, string | undefined>
  }
}
