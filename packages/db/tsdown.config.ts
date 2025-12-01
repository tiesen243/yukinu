import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/schema/index.ts'],
  dts: true,
  shims: true,
  exports: true,
})
