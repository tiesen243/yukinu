import type { OurFileRouter } from '@yukinu/uploadthing/config'

import { InputGroupButton } from '@yukinu/ui/input-group'
import { toast } from '@yukinu/ui/sonner'
import { useUploadThing } from '@yukinu/uploadthing/react'
import { useRef } from 'react'

export const InputGroupUploadButton: React.FC<{
  endpoint: keyof OurFileRouter
  onUploadComplete: (url: string) => void
}> = ({ endpoint, onUploadComplete }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const ut = useUploadThing(endpoint, {
    onClientUploadComplete: ([res]) => {
      if (res?.ufsUrl) onUploadComplete(res.ufsUrl)
      else toast.error('Failed to upload')
    },
  })

  return (
    <>
      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        max={1}
        onChange={(e) => {
          const selectedFile = e.target.files?.[0]
          if (!selectedFile) return

          ut.startUpload([selectedFile])
        }}
        hidden
      />
      <InputGroupButton
        disabled={ut.isUploading}
        onClick={() => inputRef.current?.click()}
      >
        {ut.isUploading ? 'Uploading...' : 'Upload'}
      </InputGroupButton>
    </>
  )
}
