import { generateReactHelpers } from '@uploadthing/react'

import type { OurFileRouter } from '@/config'

export const { createUpload, uploadFiles, useUploadThing } =
  generateReactHelpers<OurFileRouter>()
