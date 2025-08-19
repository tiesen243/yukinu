import type { Route } from '@react-router/types/api.uploadthing'

import { GET, POST } from '@yuki/uploader'

export const loader = async ({ request }: Route.LoaderArgs) =>
  GET(request as never)
export const action = async ({ request }: Route.ActionArgs) =>
  POST(request as never)
