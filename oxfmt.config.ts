import { defineConfig } from 'oxfmt'

export default defineConfig({
  ignorePatterns: ['.changeset/*.md'],

  jsxSingleQuote: true,
  printWidth: 80,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',

  jsdoc: {
    descriptionWithDot: true,
    preferCodeFences: true,
    separateReturnsFromParam: true,
  },

  sortImports: {
    groups: [
      'side_effect_style',
      'type-import',
      ['value-builtin', 'value-external'],
      'type-internal',
      'value-internal',
      ['type-parent', 'type-sibling', 'type-index'],
      ['value-parent', 'value-sibling', 'value-index'],
    ],
  },

  sortPackageJson: {
    sortScripts: true,
  },

  sortTailwindcss: {
    functions: ['clsx', 'cn', 'cva'],
    stylesheet: './packages/ui/src/tailwind.css',
  },
})
