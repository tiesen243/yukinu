// oxlint-disable-next-line ban-ts-comment
// @ts-nocheck

import type { OurFileRouter } from '@yukinu/uploadthing/config'

import { generateReactHelpers } from '@uploadthing/react'

import { getWebUrl } from '@/lib/utils'

export const { useUploadThing } = generateReactHelpers<OurFileRouter>({
  url: getWebUrl() + '/api/uploadthing',
})
