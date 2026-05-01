import { createEnv } from '@yukinu/lib/create-env'
import * as z from 'zod'

export const env = createEnv({
  shared: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },

  server: {
    TURNSTILE_SECRET_KEY: z.string(),
  },

  clientPrefix: 'VITE_',
  client: {
    VITE_APP_NAME: z.string().default('Yukinu'),
    VITE_DASHBOARD_URL: z.string().optional(),
    VITE_WEB_URL: z.string().optional(),

    VITE_TURNSTILE_SITE_KEY: z.string(),
  },

  runtimeEnv: process.env,
})
