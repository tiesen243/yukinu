import * as z from 'zod/mini'

import { createEnv } from '@yukinu/lib/create-env'

export const env = createEnv({
  server: {
    NODE_ENV: z._default(
      z.enum(['development', 'production', 'test']),
      'development',
    ),
  },

  clientPrefix: 'NEXT_PUBLIC_',
  client: {
    // Application settings
    NEXT_PUBLIC_APP_NAME: z._default(z.string(), 'My App'),
    NEXT_PUBLIC_WEB_URL: z.optional(z.string()),
    NEXT_PUBLIC_DASHBOARD_URL: z.optional(z.string()),
    NEXT_PUBLIC_TRPC_USE_STREAMING: z._default(
      z.enum(['true', 'false']),
      'true',
    ),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
    NEXT_PUBLIC_DASHBOARD_URL: process.env.NEXT_PUBLIC_DASHBOARD_URL,
    NEXT_PUBLIC_TRPC_USE_STREAMING: process.env.NEXT_PUBLIC_TRPC_USE_STREAMING,
  },

  skipValidation: true,
})
