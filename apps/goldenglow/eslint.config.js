import vuePlugin from 'eslint-plugin-vue'
import { parser } from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

import baseConfig, { restrictEnvAccess } from '@yuki/eslint-config/base'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['dist/**'],
  },
  ...baseConfig,
  ...restrictEnvAccess,

  ...vuePlugin.configs['flat/recommended'],

  {
    files: ['*.vue', '**/*.vue'],
    rules: {
      'vue/max-attributes-per-line': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/singleline-html-element-content-newline': 'off',
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser,
        extraFileExtensions: ['.vue'],
      },
    },
  },
]
