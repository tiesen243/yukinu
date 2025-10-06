# Linters

Consistent linting is essential in a monorepo, but each app or package (workspace) should be able to extend or override base rules as needed.

## Recommended Setup

### Example ESLint Configuration

Create an `eslint.config.js` file in the root of each app or package:

```js
import baseConfig from '@yukinu/eslint-config/base'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['dist'],
  },
  ...baseConfig,
]
```

### Monorepo Structure Example

```plaintext
. (git root)
├── apps/
│   ├── web/
│   │    └── eslint.config.js
│   └── [...other apps]
├── packages/
│   ├── api/
│   │    └── eslint.config.js
│   └── [...other shared packages]
└── tools/
    └── eslint/
        ├── base.js
        ├── next.js
        ├── react.js
        ├── package.json
        └── package.json
```

## Available ESLint Configurations

- `@yukinu/eslint-config/base` – Base configuration for all workspaces
- `@yukinu/eslint-config/next` – For Next.js apps
- `@yukinu/eslint-config/react` – For React apps

## Usage

### Lint a Single Workspace

From the workspace directory:

```bash
bun lint
```

### Lint the Entire Monorepo

From the repo root:

```bash
bun lint
bun lint:fix
```

For specific packages:

```bash
bun lint -F @yukinu/web
# or
bun --filter @yukinu/web lint
```
