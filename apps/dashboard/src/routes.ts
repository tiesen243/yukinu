import type { RouteConfig } from '@react-router/dev/routes'
import { index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  ...prefix('/api', [
    route('/auth/*', './routes/api/auth.ts'),
    route('/trpc/*', './routes/api/trpc.ts'),
  ]),

  layout('./routes/__layout.tsx', [index('./routes/_index.tsx')]),
] satisfies RouteConfig
