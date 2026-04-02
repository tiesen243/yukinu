import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/index.rsc.ts', './src/react.tsx'],
  deps: { neverBundle: ['@tanstack/react-query', 'react'] },
  dts: true,
  shims: true,
})
