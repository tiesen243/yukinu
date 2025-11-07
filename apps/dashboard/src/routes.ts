import type { RouteConfig } from '@react-router/dev/routes'
import { index, layout, route } from '@react-router/dev/routes'

export default [
  layout('./routes/layout.tsx', [
    index('./routes/_index.tsx'),
    route('/users', './routes/users.tsx'),
    route('/vendors', './routes/vendors.tsx'),
    route('/vendors/register', './routes/vendors.register.tsx'),
  ]),
] satisfies RouteConfig
