import type { OurFileRouter } from '@yukinu/uploadthing/config'

import { generateReactHelpers } from '@uploadthing/react'

import { getDashboardUrl } from '@/lib/utils'

export const { useUploadThing } = generateReactHelpers<OurFileRouter>({
  url: getDashboardUrl() + '/api/uploadthing',
})
