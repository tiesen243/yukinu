import type { OurFileRouter } from '@/config'

import { generateReactHelpers } from '@uploadthing/react'

export const { createUpload, uploadFiles, useUploadThing } =
  generateReactHelpers<OurFileRouter>()
