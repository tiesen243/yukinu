import type { RouteConfig } from '@react-router/dev/routes'

import { index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  ...prefix('/api', [
    route('/auth/*', './routes/api/auth.ts'),
    route('/trpc/*', './routes/api/trpc.ts'),
    route('/uploadthing/*', './routes/api/uploadthing.ts'),
  ]),

  route('/login', './routes/login.tsx'),
  route('/invite', './routes/invite.tsx'),

  layout('./routes/__layout.tsx', [
    index('./routes/_index.tsx'),
    route('/apply-vendor', './routes/apply-vendor.tsx'),

    layout('./routes/admin/__layout.tsx', [
      route('/admin/banners', './routes/admin/banners/_index.tsx'),

      route('/admin/categories', './routes/admin/categories/_index.tsx'),
      route(
        '/admin/categories/new',
        './routes/admin/categories/new/_index.tsx',
      ),
      route(
        '/admin/categories/:id',
        './routes/admin/categories/[id]/_index.tsx',
      ),

      route('/admin/users', './routes/admin/users/_index.tsx'),

      route('/admin/vendors', './routes/admin/vendors/_index.tsx'),
      route('/admin/products', './routes/admin/products.tsx'),
    ]),

    layout('./routes/products/__layout.tsx', [
      route('/products', './routes/products/_index.tsx'),
      route('/products/new', './routes/products/new/_index.tsx'),
      route('/products/:id', './routes/products/[id]/_index.tsx'),
      route(
        '/products/:id/variant',
        './routes/products/[id]/variant/_index.tsx',
      ),
    ]),

    layout('./routes/vendor/__layout.tsx', [
      route('/vendor/my-store', './routes/vendor/_index.tsx'),
      route('/vendor/staffs', './routes/vendor/staffs/_index.tsx'),
    ]),

    // Others
    route('/*', './routes/fallback.tsx'),
  ]),
] satisfies RouteConfig
