import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/index.rsc.ts', './src/react.tsx'],
  clean: process.env.NODE_ENV === 'production',
  dts: true,
  shims: true,
  exports: {
    customExports(exports) {
      exports['.'] = {
        default: './dist/index.mjs',
        'react-server': './dist/index.rsc.mjs',
      }
      delete exports['./index.rsc']

      return exports
    },
  },
})
