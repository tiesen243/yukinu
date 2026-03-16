import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/index.rsc.ts', './src/react.tsx'],
  deps: { neverBundle: ['@tanstack/react-query', 'react'] },
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

      exports['.'] = {
        ...(exports['.'] as Record<string, unknown>),
        'react-server': opts['./index.rsc'],
      }
      delete exports['./index.rsc']
      return exports
    },
  },
})
