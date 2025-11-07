import * as z from 'zod/v4-mini'

import { createEnv } from '@/lib/create-env'

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
    NEXT_PUBLIC_APP_DESCRIPTION: z._default(
      z.string(),
      'This is my awesome application.',
    ),
    NEXT_PUBLIC_WEB_URL: z._default(z.string(), 'localhost:3000'),
    NEXT_PUBLIC_DASHBOARD_URL: z._default(z.string(), 'localhost:5173'),
    NEXT_PUBLIC_TRPC_USE_STREAMING: z._default(
      z.enum(['true', 'false']),
      'true',
    ),

    // Vercel
    NEXT_PUBLIC_VERCEL_ENV: z.optional(
      z.enum(['development', 'preview', 'production']),
    ),
    NEXT_PUBLIC_VERCEL_URL: z.optional(z.string()),
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: z.optional(z.string()),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
    NEXT_PUBLIC_DASHBOARD_URL: process.env.NEXT_PUBLIC_DASHBOARD_URL,
    NEXT_PUBLIC_TRPC_USE_STREAMING: process.env.NEXT_PUBLIC_TRPC_USE_STREAMING,

    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL:
      process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
  },

  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION ||
    !!process.env.CI ||
    process.env.npm_lifecycle_event === 'lint',
})
