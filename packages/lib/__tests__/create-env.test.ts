import { describe, expect, it } from 'bun:test'
import * as z from 'zod'

import { createEnv } from '@/create-env'

describe('createEnv', () => {
  it('should validate shared environment variables', () => {
    const env = createEnv({
      shared: {
        NODE_ENV: z.enum(['development', 'production', 'test']),
      },
      server: {},
      clientPrefix: 'PUBLIC_',
      client: {},
      runtimeEnv: {
        NODE_ENV: 'production',
      },
    })

    expect(env.NODE_ENV).toBe('production')
  })

  it('should validate server environment variables', () => {
    const env = createEnv({
      shared: {},
      server: {
        DATABASE_URL: z.url({ protocol: /^postgres/ }),
      },
      clientPrefix: 'PUBLIC_',
      client: {},
      runtimeEnv: {
        DATABASE_URL: 'postgres://example.com/database',
      },
    })

    expect(env.DATABASE_URL).toBe('postgres://example.com/database')
  })

  it('should validate client environment variables with correct prefix', () => {
    const env = createEnv({
      shared: {},
      server: {},
      clientPrefix: 'PUBLIC_',
      client: {
        PUBLIC_API_URL: z.url(),
      },
      runtimeEnv: {
        PUBLIC_API_URL: 'https://api.example.com',
      },
    })

    expect(env.PUBLIC_API_URL).toBe('https://api.example.com')
  })
})
