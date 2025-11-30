import { defineConfig } from 'eslint/config'

import baseConfig, { restrictEnvAccess } from '@yukinu/eslint-config/base'
import reactConfig from '@yukinu/eslint-config/react'

export default defineConfig(
  {
    ignores: ['.react-router/**', 'build/**'],
  },
  ...baseConfig,
  ...reactConfig,
  ...restrictEnvAccess,
)
