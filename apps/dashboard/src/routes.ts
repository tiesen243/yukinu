import type { RouteConfig } from '@react-router/dev/routes'

import { index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  ...prefix('/api', [
    route('/auth/*', './routes/api/auth.ts'),
    route('/trpc/*', './routes/api/trpc.ts'),
    route('/uploadthing/*', './routes/api/uploadthing.ts'),
  ]),

  layout('./routes/turnstile/__root.tsx', [
    route('/login', './routes/turnstile/login.tsx'),
    route('/invite', './routes/turnstile/invite.tsx'),
  ]),

  layout('./routes/__layout.tsx', [
    index('./routes/(dashboard)/_index.tsx'),
    route('/apply-vendor', './routes/apply-vendor.tsx'),

    layout('./routes/admin/__layout.tsx', [
      route('/admin/banners', './routes/admin/banners.tsx'),

      route('/admin/categories', './routes/admin/categories/_index.tsx'),
      route('/admin/categories/new', './routes/admin/categories/new.tsx'),
      route('/admin/categories/:id', './routes/admin/categories/[id].tsx'),

      route('/admin/users', './routes/admin/users/_index.tsx'),

      route('/admin/vendors', './routes/admin/vendors/_index.tsx'),
      route('/admin/products', './routes/admin/products.tsx'),

      route('/admin/vouchers', './routes/admin/vouchers/_index.tsx'),
      route('/admin/vouchers/new', './routes/admin/vouchers/new.tsx'),
      route('/admin/vouchers/:id', './routes/admin/vouchers/[id].tsx'),
    ]),

    layout('./routes/products/__layout.tsx', [
      route('/products', './routes/products/_index.tsx'),
      route('/products/new', './routes/products/new.tsx'),
      route('/products/:id', './routes/products/[id]/_index.tsx'),
      route('/products/:id/variant', './routes/products/[id]/variant.tsx'),
    ]),

    layout('./routes/vendor/__layout.tsx', [
      route('/vendor/my-store', './routes/vendor/_index.tsx'),
      route('/vendor/staffs', './routes/vendor/staffs/_index.tsx'),
      route('/vendor/orders', './routes/vendor/orders/_index.tsx'),
      route('/vendor/orders/:id', './routes/vendor/orders/[id].tsx'),
    ]),

    layout('./routes/support/__layout.tsx', [
      route('/support/tickets', './routes/support/tickets/_index.tsx'),
      route('/support/tickets/new', './routes/support/tickets/new.tsx'),
      route('/support/tickets/:id', './routes/support/tickets/[id].tsx'),
    ]),

    // Others
    route('/*', './routes/fallback.tsx'),
  ]),
] satisfies RouteConfig
