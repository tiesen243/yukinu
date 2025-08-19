import type { Route } from '@react-router/types/api.trpc.$'

import { handler } from '@yuki/api'

export const loader = ({ request }: Route.LoaderArgs) => handler(request)
export const action = ({ request }: Route.ActionArgs) => handler(request)
