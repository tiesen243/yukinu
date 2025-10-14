import { defineConfig } from 'eslint/config'

import baseConfig from '@yukinu/eslint-config/base'

export default defineConfig(
  {
    ignores: ['dist/**'],
  },
  ...baseConfig,
  {
    files: ['src/**/*.ts'],
    rules: {
      '@typescript-eslint/no-namespace': 'off',
    },
  },
)
