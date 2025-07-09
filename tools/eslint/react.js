import reactPlugin from '@eslint-react/eslint-plugin'
import a11yPlugin from 'eslint-plugin-jsx-a11y'

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      ...reactPlugin.configs['recommended-typescript'].plugins,
      'jsx-a11y': a11yPlugin,
    },
    rules: {
      ...reactPlugin.configs['recommended-typescript'].rules,
      ...a11yPlugin.flatConfigs.strict.rules,
    },
    settings: reactPlugin.configs['recommended-typescript'].settings,
  },
]
