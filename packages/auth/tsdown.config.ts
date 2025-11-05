import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/index.rsc.ts', './src/react.tsx'],
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
