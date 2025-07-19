import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from '@uploadthing/react'

import type { OurFileRouter } from './config'

const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>()
const UploadButton = generateUploadButton<OurFileRouter>()
const UploadDropzone = generateUploadDropzone<OurFileRouter>()

export type { ClientUploadedFileData } from 'uploadthing/types'
export type { OurFileRouter }
export { useUploadThing, uploadFiles, UploadButton, UploadDropzone }
