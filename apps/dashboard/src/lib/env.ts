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

  clientPrefix: 'VITE_',
  client: {
    VITE_APP_NAME: z._default(z.string(), 'Yukinu'),
    VITE_DASHBOARD_URL: z._default(z.url(), 'http://localhost:5173'),
    VITE_WEB_URL: z._default(z.url(), 'http://localhost:3000'),

    VITE_TURNSTILE_SITE_KEY: z.string(),
  },

  runtimeEnv: {
    ...process.env,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_APP_URL: import.meta.env.VITE_APP_URL,
  },

  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION ||
    !!process.env.CI ||
    process.env.npm_lifecycle_event === 'lint',
})
