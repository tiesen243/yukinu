import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/config.ts', './src/types.ts'],
  dts: true,
  shims: true,
  exports: true,
})
