import type { Route } from './+types/trpc'

import { handler } from '@yukinu/api'

export const loader = ({ request }: Route.LoaderArgs) => handler(request)
export const action = ({ request }: Route.ActionArgs) => handler(request)
