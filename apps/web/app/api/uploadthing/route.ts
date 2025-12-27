import { createNextRouteHandler } from '@yukinu/uploadthing'
import { ourFileRouter, config } from '@yukinu/uploadthing/config'

export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
  config,
})
