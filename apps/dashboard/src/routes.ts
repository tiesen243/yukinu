import type { RouteConfig } from '@react-router/dev/routes'

import { index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  ...prefix('/api', [
    route('/auth/*', './routes/api/auth.ts'),
    route('/trpc/*', './routes/api/trpc.ts'),
    route('/uploadthing/*', './routes/api/uploadthing.ts'),
  ]),

  layout('./components/protected.tsx', [
    // Mangement routes
    route('/management/banners', './routes/(management)/banners/_index.tsx'),
    route('/management/users', './routes/(management)/users/_index.tsx'),
    route('/management/vouchers', './routes/(management)/vouchers/_index.tsx'),
    route('/management/orders', './routes/(management)/orders/_index.tsx'),

    // Catalog routes
    route('/catalog/categories', './routes/(catalog)/categories/_index.tsx'),
    route('/catalog/products', './routes/(catalog)/products/_index.tsx'),

    // Merchant routes
    route('/merchant/vendors', './routes/(merchant)/vendors/_index.tsx'),
    route('/merchant/my-store', './routes/(merchant)/my-store/_index.tsx'),
    route('/merchant/staffs', './routes/(merchant)/staffs/_index.tsx'),
    route('/merchant/balance', './routes/(merchant)/balance/_index.tsx'),

    // Other routes
    index('./routes/(others)/dashboard/_index.tsx'),
    route('/analytics', './routes/(others)/analytics/_index.tsx'),
    route('/tickets', './routes/(others)/tickets/_index.tsx'),
  ]),

  layout('./components/turnstile.tsx', [route('/login', './routes/login.tsx')]),
] satisfies RouteConfig
