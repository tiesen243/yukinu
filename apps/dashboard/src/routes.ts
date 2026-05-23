import type { RouteConfig } from '@react-router/dev/routes'

import { index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  ...prefix('/api', [
    route('/auth/*', './routes/api/auth.ts'),
    route('/trpc/*', './routes/api/trpc.ts'),
    route('/turnstile', './routes/api/turnstile.ts'),
    route('/uploadthing/*', './routes/api/uploadthing.ts'),
  ]),

  layout('./components/protected.tsx', [
    // Catalog routes
    route('/catalog', './routes/catalog/_index.tsx'),
    route('/catalog/categories', './routes/catalog/categories/_index.tsx'),
    route('/catalog/categories/new', './routes/catalog/categories/new.tsx'),
    route('/catalog/categories/:id', './routes/catalog/categories/[id].tsx'),
    route('/catalog/products', './routes/catalog/products/_index.tsx'),
    route('/catalog/products/new', './routes/catalog/products/new.tsx'),
    route('/catalog/products/:id', './routes/catalog/products/[id].tsx'),
    route(
      '/catalog/products/:id/variant',
      './routes/catalog/products/[id].variant.tsx',
    ),

    // Mangement routes
    route('/management', './routes/management/_index.tsx'),
    route('/management/banners', './routes/management/banners/_index.tsx'),
    route('/management/orders', './routes/management/orders/_index.tsx'),
    route(
      '/management/transactions',
      './routes/management/transactions/_index.tsx',
    ),
    route('/management/users', './routes/management/users/_index.tsx'),
    route('/management/vendors', './routes/management/vendors/_index.tsx'),
    route('/management/vouchers', './routes/management/vouchers/_index.tsx'),

    // Merchant routes
    route('/merchant', './routes/merchant/_index.tsx'),
    route('/merchant/my-store', './routes/merchant/my-store/_index.tsx'),
    route('/merchant/staffs', './routes/merchant/staffs/_index.tsx'),
    route('/merchant/balance', './routes/merchant/balance/_index.tsx'),

    // Other routes
    index('./routes/dashboard/_index.tsx'),
    route('/analytics', './routes/analytics/_index.tsx'),
    route('/support-tickets', './routes/support-tickets/_index.tsx'),
  ]),

  layout('./components/turnstile.tsx', [
    route('/login', './routes/login.tsx'),
    route('/register-vendor', './routes/register-vendor.tsx'),
    route('/accept-invitation', './routes/accept-invitation.tsx'),
  ]),
] satisfies RouteConfig
