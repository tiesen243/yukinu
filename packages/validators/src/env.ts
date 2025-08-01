import * as z from 'zod/v4-mini'

export const env = createEnv({
  server: {
    NODE_ENV: z._default(
      z.enum(['development', 'production', 'test']),
      'development',
    ),

    DATABASE_URL: z.string().check(z.startsWith('postgresql://')),

    AUTH_FACEBOOK_ID: z.string(),
    AUTH_FACEBOOK_SECRET: z.string(),
    AUTH_GOOGLE_ID: z.string(),
    AUTH_GOOGLE_SECRET: z.string(),

    UPLOADTHING_TOKEN: z.string(),

    RESEND_TOKEN: z.string(),

    // Vercel environment variables
    VERCEL: z.optional(z.string()),
    VERCEL_ENV: z.optional(z.enum(['production', 'preview', 'development'])),
    VERCEL_URL: z.optional(z.string()),
    VERCEL_PROJECT_PRODUCTION_URL: z.optional(z.string()),
  },

  client: {
    NEXT_PUBLIC_APP_URL: z._default(z.url(), 'http://localhost:3000'),
    NEXT_PUBLIC_API_URL: z._default(z.url(), 'http://localhost:3001'),
  },

  runtimeEnv: process.env,

  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION ||
    !!process.env.CI ||
    process.env.npm_lifecycle_event === 'lint',
})

function createEnv<
  TPrefix extends 'NEXT_PUBLIC_',
  TServer extends Record<string, z.ZodMiniType>,
  TClient extends Record<string, z.ZodMiniType>,
  TResult extends {
    [TKey in keyof (TServer & TClient)]: z.infer<(TServer & TClient)[TKey]>
  },
>(opts: {
  server: {
    [TKey in keyof TServer]: TKey extends `${TPrefix}${string}`
      ? `${TKey} should not prefix with ${TPrefix}`
      : TServer[TKey]
  }
  client: {
    [TKey in keyof TClient]: TKey extends `${TPrefix}${string}`
      ? TClient[TKey]
      : `${TKey extends string ? TKey : never} should prefix with ${TPrefix}`
  }
  runtimeEnv:
    | { [TKey in keyof TResult]: string | undefined }
    | Record<string, unknown>
  skipValidation: boolean
}): TResult {
  for (const [key, value] of Object.entries(opts.runtimeEnv)) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    if (value === '') delete opts.runtimeEnv[key]
  }

  const _server = typeof opts.server === 'object' ? opts.server : {}
  const _client = typeof opts.client === 'object' ? opts.client : {}
  const isServer = typeof window === 'undefined'
  const envs = isServer ? { ..._server, ..._client } : { ..._client }

  const parsedEnvs = z.object(envs).safeParse(opts.runtimeEnv)
  if (!opts.skipValidation && !parsedEnvs.success)
    throw new Error(
      `❌ Environment variables validation failed:\n${parsedEnvs.error.message}`,
    )

  const envData = parsedEnvs.success ? parsedEnvs.data : {}
  return new Proxy(envData as TResult, {
    get(target, prop) {
      if (!isServer && prop in opts.server)
        throw new Error(
          `❌ Attempted to access a server-side environment variable on the client`,
        )
      return target[prop as keyof typeof target]
    },
  })
}
