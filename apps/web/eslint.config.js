import { defineConfig } from 'eslint/config'

import baseConfig, { restrictEnvAccess } from '@yukinu/eslint-config/base'
import nextConfig from '@yukinu/eslint-config/next'
import reactConfig from '@yukinu/eslint-config/react'

export default defineConfig(
  {
    ignores: ['.next/**', 'next-env.d.ts'],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextConfig,
  ...restrictEnvAccess,
)
