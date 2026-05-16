import { UTApi } from 'uploadthing/server'

export const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN })
export { createRouteHandler as createNextRouteHandler } from 'uploadthing/next'
export { createRouteHandler as createRemixRouteHandler } from 'uploadthing/remix'
