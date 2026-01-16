// oxlint-disable-next-line ban-ts-comment
// @ts-nocheck - Next.js types are messed up until they fix the monorepo support

import { createNextRouteHandler } from '@yukinu/uploadthing'
import { ourFileRouter, config } from '@yukinu/uploadthing/config'

export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
  config,
})
