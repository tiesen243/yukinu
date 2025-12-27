import type { RouteHandlerConfig } from 'uploadthing/types'

import { env } from '@yukinu/validators/env'
import { createRouteHandler as createNextRouteHandler } from 'uploadthing/next'
import { createRouteHandler as createRemixRouteHandler } from 'uploadthing/remix'
import { UTApi } from 'uploadthing/server'

import { ourFileRouter } from '@/config'

const config = {
  token: env.UPLOADTHING_TOKEN,
} satisfies RouteHandlerConfig

const createNextHandler = () =>
  createNextRouteHandler({
    router: ourFileRouter,
    config,
  })

const createRemixHandler = () =>
  createRemixRouteHandler({
    router: ourFileRouter,
    config,
  })

const utapi = new UTApi({
  token: env.UPLOADTHING_TOKEN,
})

export { createNextHandler, createRemixHandler, utapi }
