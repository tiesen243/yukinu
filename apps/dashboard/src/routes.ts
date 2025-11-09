import type { RouteConfig } from '@react-router/dev/routes'
import { index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  ...prefix('/api', [
    route('/auth/*', './routes/api/auth.ts'),
    route('/trpc/*', './routes/api/trpc.ts'),
  ]),

  layout('./routes/dashboard/layout.tsx', [
    index('./routes/dashboard/_index.tsx'),

    ...prefix('/users', [index('./routes/dashboard/users/_index.tsx')]),

    ...prefix('/vendors', [
      index('./routes/dashboard/vendors/_index.tsx'),
      route('/register', './routes/dashboard/vendors/register.tsx'),
    ]),
  ]),
] satisfies RouteConfig
