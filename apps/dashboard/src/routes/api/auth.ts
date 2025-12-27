import type { Route } from './+types/auth'

import { handler } from '@yukinu/auth'

export const loader = ({ request }: Route.LoaderArgs) => handler(request)
export const action = ({ request }: Route.ActionArgs) => handler(request)
