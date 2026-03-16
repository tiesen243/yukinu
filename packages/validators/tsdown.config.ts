import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/*.ts'],
  dts: true,
  shims: true,
  exports: {
    customExports(opts) {
      const exports: Record<string, unknown> = {}
      for (const entry of Object.keys(opts))
        exports[entry] = opts[entry].endsWith('.mjs')
          ? {
              types: opts[entry].replace('.mjs', '.d.mts'),
              default: opts[entry],
            }
          : (exports[entry] = opts[entry])

      return exports
    },
  },
})
