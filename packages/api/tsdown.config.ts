import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/types.ts'],
  clean: process.env.NODE_ENV === 'production',
  dts: true,
  shims: true,
  exports: true,
})
