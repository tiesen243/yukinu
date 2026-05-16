import core from '@yukinu/oxc/core'
import jest from '@yukinu/oxc/jest'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extends: [core, jest],
})
