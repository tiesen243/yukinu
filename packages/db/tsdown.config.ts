import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/schema/index.ts'],
  dts: true,
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
