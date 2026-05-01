import { createRemixRouteHandler } from '@yukinu/uploadthing'
import { config, ourFileRouter } from '@yukinu/uploadthing/config'

import type { Route } from './+types/auth'

const handler = createRemixRouteHandler({ router: ourFileRouter, config })
export const loader = ({ request }: Route.LoaderArgs) => handler.loader(request)
export const action = ({ request }: Route.ActionArgs) => handler.action(request)
