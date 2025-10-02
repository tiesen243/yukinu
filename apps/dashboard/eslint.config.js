import baseConfig, { restrictEnvAccess } from '@yukinu/eslint-config/base'
import reactConfig from '@yukinu/eslint-config/react'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['.react-router/**', 'build/**'],
  },
  ...baseConfig,
  ...reactConfig,
  ...restrictEnvAccess,
]
