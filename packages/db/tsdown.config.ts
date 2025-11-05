import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/schema/*.ts'],
  dts: true,
  shims: true,
  exports: {
    customExports(exports) {
      Object.keys(exports).forEach((key) => {
        if (key.startsWith('./schema/') && key !== './schema/*')
          delete exports[key]
      })

      exports['./schema/*'] = {
        default: './dist/schema/*.mjs',
        types: './dist/schema/*.d.mts',
      }

      return exports
    },
  },
})
