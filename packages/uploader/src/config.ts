import { createUploadthing } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

import { auth } from '@yuki/auth'

const f = createUploadthing()

export const ourFileRouter = {
  productUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const session = await auth(req)
      if (!session.user) throw new UploadThingError('Unauthorized') as Error
      if (session.user.role !== 'admin')
        throw new UploadThingError('Forbidden') as Error
      return { userId: session.user.id }
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)
      console.log('file url', file.ufsUrl)
      return { uploadedBy: metadata.userId }
    }),

  avatarUploader: f({
    image: {
      maxFileSize: '2MB',
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const session = await auth(req)
      if (!session.user) throw new UploadThingError('Unauthorized') as Error
      return { userId: session.user.id }
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)
      console.log('file url', file.ufsUrl)
      return { uploadedBy: metadata.userId }
    }),
}

export type OurFileRouter = typeof ourFileRouter
