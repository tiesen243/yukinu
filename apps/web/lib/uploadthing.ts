import type { OurFileRouter } from '@yukinu/uploadthing/config'

import { generateReactHelpers } from '@uploadthing/react'

import { getWebUrl } from '@/lib/utils'

const helpers = generateReactHelpers<OurFileRouter>({
  url: getWebUrl() + '/api/uploadthing',
})

export const useUploadThing = helpers.useUploadThing
