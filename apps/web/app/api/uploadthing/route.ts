import type { NextRequest } from 'next/server'

import { createNextRouteHandler } from '@yukinu/uploadthing'
import { ourFileRouter, config } from '@yukinu/uploadthing/config'

type NextRouteHandler = (
  request: NextRequest,
  // oxlint-disable-next-line typescript/no-invalid-void-type
) => void | Response | Promise<void | Response>

export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
  config,
}) as { GET: NextRouteHandler; POST: NextRouteHandler }
