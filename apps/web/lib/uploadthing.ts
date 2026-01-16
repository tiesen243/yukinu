import '@yukinu/uploadthing/types'

import type { OurFileRouter } from '@yukinu/uploadthing/types'

import { generateReactHelpers } from '@uploadthing/react'

import { getWebUrl } from '@/lib/utils'

export const { useUploadThing } = generateReactHelpers<OurFileRouter>({
  url: getWebUrl() + '/api/uploadthing',
})
