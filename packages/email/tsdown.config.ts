import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  deps: { neverBundle: ['react'] },
  dts: true,
  shims: true,
  minify: true,
})
