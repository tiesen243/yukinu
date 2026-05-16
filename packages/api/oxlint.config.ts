import core from '@yukinu/oxc/core'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extends: [core],
  overrides: [
    {
      files: ['src/**/*.ts'],
      rules: {
        'class-methods-use-this': 'off',

        'typescript/no-empty-interface': 'off',
        'typescript/no-empty-object-type': 'off',
      },
    },
  ],
})
