import * as z from 'zod/v4-mini'

import { createEnv } from '@/lib/create-env'

export const env = createEnv({
  server: {},

  clientPrefix: 'VITE_',
  client: {
    // Application settings
    VITE_APP_NAME: z._default(z.string(), 'My App'),
    VITE_APP_DESCRIPTION: z._default(
      z.string(),
      'This is my awesome application.',
    ),
    VITE_TRPC_USE_STREAMING: z._default(z.enum(['true', 'false']), 'true'),

    // Vercel
    VITE_VERCEL_ENV: z.optional(
      z.enum(['development', 'preview', 'production']),
    ),
    VITE_VERCEL_URL: z.optional(z.string()),
    VITE_VERCEL_PROJECT_PRODUCTION_URL: z.optional(z.string()),
  },

  runtimeEnv: {
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION,
    VITE_TRPC_USE_STREAMING: import.meta.env.VITE_TRPC_USE_STREAMING,

    VITE_VERCEL_ENV: import.meta.env.VITE_VERCEL_ENV,
    VITE_VERCEL_URL: import.meta.env.VITE_VERCEL_URL,
    VITE_VERCEL_PROJECT_PRODUCTION_URL: import.meta.env
      .VITE_VERCEL_PROJECT_PRODUCTION_URL,
  },

  skipValidation: true,
})
