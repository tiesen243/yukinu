import type { NextRequest } from 'next/server'

import { createNextRouteHandler } from '@yukinu/uploadthing'
import { ourFileRouter, config } from '@yukinu/uploadthing/config'

type NextRouteHandler = (
  request: NextRequest,
) => void | Response | Promise<void | Response>

export const { GET, POST }: { GET: NextRouteHandler; POST: NextRouteHandler } =
  createNextRouteHandler({
    router: ourFileRouter,
    config,
  })
