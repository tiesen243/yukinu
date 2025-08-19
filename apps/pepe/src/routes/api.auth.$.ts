import type { Route } from '@react-router/types/api.auth.$'

import { handlers } from '@yuki/auth'

const { GET, POST } = handlers
export const loader = ({ request }: Route.LoaderArgs) => GET(request)
export const action = ({ request }: Route.ActionArgs) => POST(request)
