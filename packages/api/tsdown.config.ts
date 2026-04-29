import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/modules/*/types.ts'],
  dts: true,
  shims: true,
  minify: true,
})
