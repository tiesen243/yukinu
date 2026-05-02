import { createRemixRouteHandler } from '@yukinu/uploadthing'
import { config, ourFileRouter } from '@yukinu/uploadthing/config'

export const { loader, action } = createRemixRouteHandler({
  router: ourFileRouter,
  config,
})
