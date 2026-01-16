import type { OurFileRouter } from '@yukinu/uploadthing/config'

import { generateReactHelpers } from '@uploadthing/react'

import { getWebUrl } from '@/lib/utils'

export const { useUploadThing } = generateReactHelpers<OurFileRouter>({
  url: getWebUrl() + '/api/uploadthing',
}) as ReturnType<typeof generateReactHelpers<OurFileRouter>>
