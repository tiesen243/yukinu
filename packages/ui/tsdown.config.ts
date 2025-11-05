import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/lib/utils.ts', './src/components/*.tsx', './src/hooks/*.tsx'],
  copy: ['./src/tailwind.css'],
  dts: true,
  shims: true,
  exports: {
    customExports() {
      return {
        '.': './dist/lib/utils.mjs',
        './*': './dist/components/*.mjs',
        './hooks/*': './dist/hooks/*.mjs',
        './tailwind.css': './dist/tailwind.css',
        './package.json': './package.json',
      }
    },
  },
})
