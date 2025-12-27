import { createRemixRouteHandler } from '@yukinu/uploadthing'
import { ourFileRouter, config } from '@yukinu/uploadthing/config'

const handler = createRemixRouteHandler({ router: ourFileRouter, config })
export const loader = handler.loader
export const action = handler.action
