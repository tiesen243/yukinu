import { handler } from '@yukinu/api'

import type { Route } from './+types/trpc'

export const loader = ({ request }: Route.LoaderArgs) =>
  handler(request, '/dashboard/api/trpc')
export const action = ({ request }: Route.ActionArgs) =>
  handler(request, '/dashboard/api/trpc')
