import { createNextRouteHandler } from '@yukinu/uploadthing'
import { config, ourFileRouter } from '@yukinu/uploadthing/config'

export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
  config,
})
