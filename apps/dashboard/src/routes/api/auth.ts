import { handlers } from '@yukinu/auth'

import type { Route } from './+types/auth'

const { GET, POST } = handlers

export const loader = ({ request }: Route.LoaderArgs) => GET(request)
export const action = ({ request }: Route.ActionArgs) => POST(request)
