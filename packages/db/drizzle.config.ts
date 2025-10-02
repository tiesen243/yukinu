import { defineConfig } from 'drizzle-kit'

import { env } from '@yukinu/validators/env'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DATABASE,
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    ssl: env.NODE_ENV === 'production' ? 'require' : false,
  },
  schema: './src/schemas',
  casing: 'snake_case',
  strict: true,
})
