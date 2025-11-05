import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/*.ts'],
  clean: process.env.NODE_ENV === 'production',
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
