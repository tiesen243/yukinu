import { createRemixRouteHandler } from '@yukinu/uploadthing'
import { ourFileRouter, config } from '@yukinu/uploadthing/config'

export const handlers = createRemixRouteHandler({
  router: ourFileRouter,
  config,
})
export const loader = handlers.loader
export const action = handlers.action
