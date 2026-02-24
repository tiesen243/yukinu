import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  external: ['react'],
  dts: true,
  shims: true,
  exports: true,
})
