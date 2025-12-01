import type { RouteConfig } from '@react-router/dev/routes'
import { index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  ...prefix('/api', [
    route('/auth/*', './routes/api/auth.ts'),
    route('/trpc/*', './routes/api/trpc.ts'),
  ]),

  route('/login', './routes/login/_index.tsx'),

  layout('./routes/__layout.tsx', [
    index('./routes/_index.tsx'),
    route('/vendors', './routes/vendors/_index.tsx'),
    route('/*', './routes/fallback.tsx'),
  ]),
] satisfies RouteConfig
