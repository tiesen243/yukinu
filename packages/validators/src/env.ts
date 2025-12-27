import { createEnv } from '@yukinu/lib/create-env'
import * as z from 'zod/mini'

export const env = createEnv({
  server: {
    NODE_ENV: z._default(
      z.enum(['development', 'production', 'test']),
      'development',
    ),

    // Database configuration
    POSTGRES_HOST: z._default(z.string(), '127.0.0.1'),
    POSTGRES_PORT: z._default(z.coerce.number(), 5432),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DATABASE: z.string(),
    POSTGRES_SSL_MODE: z._default(z.enum(['true', 'false']), 'false'),

    // Auth configuration
    AUTH_SECRET: z.optional(z.string()),
    AUTH_FACEBOOK_ID: z.string(),
    AUTH_FACEBOOK_SECRET: z.string(),
    AUTH_GOOGLE_ID: z.string(),
    AUTH_GOOGLE_SECRET: z.string(),

    // Third-party services
    RESEND_TOKEN: z.string(),
    UPLOADTHING_TOKEN: z.string(),

    // Vercel environment
    VERCEL: z.optional(z.enum(['1'])),
    VERCEL_PROJECT_PRODUCTION_URL: z.optional(z.string()),
  },

  clientPrefix: 'PUBLIC_',
  client: {},

  runtimeEnv: process.env,

  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION ||
    !!process.env.CI ||
    process.env.npm_lifecycle_event === 'lint',
})
