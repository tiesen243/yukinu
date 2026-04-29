import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/*.ts', '!./src/*.test.ts'],
  deps: { neverBundle: ['@tanstack/react-query'] },
  dts: true,
  shims: true,
})
