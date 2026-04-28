import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/*.ts', '!./src/*.test.ts'],
  dts: true,
  shims: true,
})
