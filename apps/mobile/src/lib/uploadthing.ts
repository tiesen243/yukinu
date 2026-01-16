import type { OurFileRouter } from '@yukinu/uploadthing/types'

import { generateReactNativeHelpers } from '@uploadthing/expo'

import { getBaseUrl } from '@/lib/utils'

export const { useUploadThing } = generateReactNativeHelpers<OurFileRouter>({
  url: getBaseUrl() + '/api/uploadthing',
})
