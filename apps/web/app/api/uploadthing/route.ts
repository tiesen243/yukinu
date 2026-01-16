import type { NextRequest } from 'next/server'

import { createNextRouteHandler } from '@yukinu/uploadthing'
import { ourFileRouter, config } from '@yukinu/uploadthing/config'

export const handler = createNextRouteHandler({ router: ourFileRouter, config })
export const GET = (req: NextRequest) => handler.GET(req)
export const POST = (req: NextRequest) => handler.POST(req)
