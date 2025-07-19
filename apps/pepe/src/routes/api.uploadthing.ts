import { GET, POST } from '@yuki/uploader'

import type { Route } from './+types/api.uploadthing'

export const loader = async ({ request }: Route.LoaderArgs) =>
  GET(request as never)
export const action = async ({ request }: Route.ActionArgs) =>
  POST(request as never)
