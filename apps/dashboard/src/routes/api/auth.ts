import { handlers } from '@yukinu/auth'

import type { Route } from './+types/auth'

export const loader = ({ request }: Route.LoaderArgs) => handlers(request)
export const action = ({ request }: Route.ActionArgs) => handlers(request)
