import { generateReactHelpers } from '@uploadthing/react'

import type { OurFileRouter } from '@/config'

export const { useUploadThing } = generateReactHelpers<OurFileRouter>()
