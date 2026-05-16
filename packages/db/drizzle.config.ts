import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  casing: 'snake_case',
  dialect: 'postgresql',
  strict: true,

  schema: './src/schema.ts',
  out: './migrations',

  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      'postgresql://yukinu:supersecret@127.0.0.1:5432/db',
  },
})
