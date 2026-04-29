import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/schema.ts', './src/drizzle.ts'],
  dts: true,
  shims: true,
  minify: true,
})
