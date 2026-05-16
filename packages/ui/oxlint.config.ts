import core from '@yukinu/oxc/core'
import react from '@yukinu/oxc/react'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extends: [core, react],
  rules: {
    'jsx-a11y/prefer-tag-over-role': 'off',
  },
})
