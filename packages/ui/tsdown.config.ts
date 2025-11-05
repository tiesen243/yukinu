import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/lib/utils.ts', './src/components/*.tsx', './src/hooks/*.tsx'],
  external: ['react', 'react/jsx-runtime'],
  dts: true,
  shims: true,
  exports: {
    customExports() {
      return {
        '.': './dist/lib/utils.mjs',
        './*': './dist/components/*.mjs',
        './hooks/*': './dist/hooks/*.mjs',
        './tailwind.css': './src/tailwind.css',
        './package.json': './package.json',
      }
    },
  },
})
