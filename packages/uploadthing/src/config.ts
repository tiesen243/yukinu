import type { FileRouter, RouteHandlerConfig } from 'uploadthing/types'

import { auth } from '@yukinu/auth'
import { env } from '@yukinu/validators/env'
import { createUploadthing, UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

const sharedFileRouteConfig = f({
  image: { maxFileSize: '4MB', maxFileCount: 1 },
})
  // @ts-expect-error req is only available in certain environments
  .middleware(async ({ event, req }) => {
    const request = req ?? ('request' in event ? event.request : null)
    if (!request)
      throw new UploadThingError({
        message: 'No request object found',
        code: 'INTERNAL_SERVER_ERROR',
      })

    const session = await auth({ headers: request.headers })
    if (!session.user)
      throw new UploadThingError({
        message: 'User not authenticated',
        code: 'FORBIDDEN',
      })

    return { userId: session.user.id }
  })
  .onUploadComplete(({ metadata, file }) => {
    console.log('Upload complete for userId:', metadata.userId)
    console.log('file url', file.ufsUrl)
    return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl }
  })

export const ourFileRouter = {
  avatarUploader: sharedFileRouteConfig,
  bannerUploader: sharedFileRouteConfig,
  categoryImageUploader: sharedFileRouteConfig,
  productImageUploader: sharedFileRouteConfig,
} as const satisfies FileRouter

export const config = {
  token: env.UPLOADTHING_TOKEN,
} satisfies RouteHandlerConfig

export type OurFileRouter = typeof ourFileRouter
