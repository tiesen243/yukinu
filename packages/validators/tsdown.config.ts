import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/*.ts'],
  dts: true,
  shims: true,
  exports: {
    customExports() {
      return {
        './*': './dist/*.mjs',
        './package.json': './package.json',
      }
    },
  },
})
