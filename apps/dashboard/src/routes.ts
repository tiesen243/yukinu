import type { RouteConfig } from '@react-router/dev/routes'
import { index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  ...prefix('/api', [
    route('/auth/*', './routes/api/auth.ts'),
    route('/trpc/*', './routes/api/trpc.ts'),
  ]),

  route('/login', './routes/login.tsx'),
  route('/invite', './routes/invite.tsx'),

  layout('./routes/__layout.tsx', [
    index('./routes/_index.tsx'),
    route('/apply-vendor', './routes/apply-vendor.tsx'),

    layout('./routes/admin/__layout.tsx', [
      route('/admin/vendors', './routes/admin/vendors/_index.tsx'),
      route('/products/admin', './routes/products/admin.tsx'),
    ]),

    layout('./routes/products/__layout.tsx', [
      route('/products', './routes/products/_index.tsx'),
      route('/products/new', './routes/products/new.tsx'),
      route('/products/:id', './routes/products/[id]/_index.tsx'),
    ]),

    layout('./routes/vendor/__layout.tsx', [
      route('/vendor/my-store', './routes/vendor/_index.tsx'),
      route('/vendor/staffs', './routes/vendor/staffs/_index.tsx'),
    ]),

    // Others
    route('/*', './routes/fallback.tsx'),
  ]),
] satisfies RouteConfig
