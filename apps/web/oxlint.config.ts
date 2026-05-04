import core from '@yukinu/oxc/core'
import next from '@yukinu/oxc/next'
import react from '@yukinu/oxc/react'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extends: [core, react, next],
})
