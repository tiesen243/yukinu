import { defineConfig } from 'drizzle-kit'

import { Readable, Writable } from 'node:stream'
import zlib from 'node:zlib'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.POSTGRES_HOST ?? '',
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    user: process.env.POSTGRES_USER ?? '',
    password: process.env.POSTGRES_PASSWORD ?? '',
    database: process.env.POSTGRES_DATABASE ?? '',
    ssl: process.env.POSTGRES_SSL_MODE === 'true' ? 'require' : false,
  },
  schema: './src/schema/index.ts',
  casing: 'snake_case',
  strict: true,
})

/**
 * This is a polyfill for the CompressionStream.
 * This solves the issue where Drizzle Studio Can't find variable: CompressionStream
 *
 * ![BUG]: ReferenceError: Can't find variable: CompressionStream
 * @see https://github.com/drizzle-team/drizzle-orm/issues/3880
 *
 * Bun doesn't have CompressionStream yet
 * @see https://github.com/oven-sh/bun/issues/1723
 */
const transformMap = {
  deflate: zlib.createDeflate,
  'deflate-raw': zlib.createDeflateRaw,
  gzip: zlib.createGzip,
}

globalThis.CompressionStream ??= class CompressionStream {
  readable
  writable
  constructor(format: 'deflate' | 'deflate-raw' | 'gzip') {
    const handle = transformMap[format]()
    this.readable = Readable.toWeb(handle)
    this.writable = Writable.toWeb(handle)
  }
}
