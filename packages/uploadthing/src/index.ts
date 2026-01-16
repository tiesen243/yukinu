import { env } from '@yukinu/validators/env'
import { UTApi } from 'uploadthing/server'

export type * from 'uploadthing/types'
export const utapi = new UTApi({ token: env.UPLOADTHING_TOKEN })
export { createRouteHandler as createNextRouteHandler } from 'uploadthing/next'
export { createRouteHandler as createRemixRouteHandler } from 'uploadthing/remix'
