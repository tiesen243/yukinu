import type { RouteConfig } from '@react-router/dev/routes'
import { index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  ...prefix('/api', [
    route('/auth/*', './routes/api/auth.ts'),
    route('/trpc/*', './routes/api/trpc.ts'),
  ]),

  layout('./routes/dashboard/layout.tsx', [
    index('./routes/dashboard/_index.tsx'),
    route('/categories', './routes/dashboard/categories.tsx'),

    ...prefix('/products', [
      index('./routes/dashboard/products/_index.tsx'),
      route('/create', './routes/dashboard/products/create.tsx'),
    ]),

    ...prefix('/users', [index('./routes/dashboard/users/_index.tsx')]),

    ...prefix('/vendors', [
      index('./routes/dashboard/vendors/_index.tsx'),
      route('/register', './routes/dashboard/vendors/register.tsx'),
    ]),

    route('/*', './routes/dashboard/placeholder.tsx'),
  ]),
] satisfies RouteConfig
