import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/config.ts', './src/react.tsx'],
  dts: true,
  shims: true,
  exports: true,
})
