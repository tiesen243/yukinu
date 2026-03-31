import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/utils.ts', 'src/components/*.tsx', 'src/hooks/*.tsx'],
  deps: { neverBundle: ['react'] },
  copy: ['src/tailwind.css'],
  dts: true,
  shims: true,
  minify: true,
})
