import { handler } from '@yukinu/auth'

import type { Route } from './+types/auth'

export const loader = ({ request }: Route.LoaderArgs) => handler(request)
export const action = ({ request }: Route.ActionArgs) => handler(request)
