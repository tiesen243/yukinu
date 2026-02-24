import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/index.rsc.ts', './src/react.tsx'],
  external: ['@tanstack/react-query', 'react'],
  dts: true,
  shims: true,
  exports: {
    customExports(exports) {
      exports['.'] = {
        'react-server': './dist/index.rsc.mjs',
        default: './dist/index.mjs',
      }
      delete exports['./index.rsc']

      exports['./react'] = {
        types: './dist/react.d.mts',
        default: './dist/react.mjs',
      }

      return exports
    },
  },
})
