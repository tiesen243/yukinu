import { createEnv } from '@yukinu/lib/create-env'
import * as z from 'zod/mini'

export const env = createEnv({
  shared: {
    NODE_ENV: z._default(
      z.enum(['development', 'production', 'test']),
      'development',
    ),
  },

  server: {
    DATABASE_URL: z.url({ protocol: /^postgresql$/ }),

    AUTH_SECRET: z.string(),
    AUTH_GITHUB_ID: z.string(),
    AUTH_GITHUB_SECRET: z.string(),
    AUTH_GOOGLE_ID: z.string(),
    AUTH_GOOGLE_SECRET: z.string(),

    RESEND_TOKEN: z.string(),
    UPLOADTHING_TOKEN: z.string(),
    TURNSTILE_SECRET_KEY: z.string(),
  },

  clientPrefix: 'NEXT_PUBLIC_',
  client: {
    NEXT_PUBLIC_APP_NAME: z._default(z.string(), 'Yukinu'),
    NEXT_PUBLIC_DASHBOARD_URL: z._default(z.url(), 'http://localhost:5173'),
    NEXT_PUBLIC_WEB_URL: z._default(z.url(), 'http://localhost:3000'),

    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string(),
  },

  runtimeEnv: {
    ...process.env,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_DASHBOARD_URL: process.env.NEXT_PUBLIC_DASHBOARD_URL,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  },

  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION ||
    !!process.env.CI ||
    process.env.npm_lifecycle_event === 'lint',
})
