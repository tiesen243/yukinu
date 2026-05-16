import { createRemixRouteHandler } from '@yukinu/uploadthing'
import { config, ourFileRouter } from '@yukinu/uploadthing/config'

const { loader, action } = createRemixRouteHandler({
  router: ourFileRouter,
  config,
})
export { loader, action }
