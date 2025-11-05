import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/types.ts', './src/schema/*.ts'],
  clean: process.env.NODE_ENV === 'production',
  dts: true,
  shims: true,
  exports: {
    customExports(exports) {
      Object.keys(exports).forEach((key) => {
        if (key.startsWith('./schema/') && key !== './schema/*')
          delete exports[key]
      })
      exports['./schema/*'] = './dist/schema/*.mjs'
      return exports
    },
  },
})
