'use client'

import * as React from 'react'

import type { ClientUploadedFileData } from '@yuki/uploader/react'
import { Button } from '@yuki/ui/button'
import { useUploadThing } from '@yuki/uploader/react'

interface UploadButtonProps
  extends Omit<React.ComponentProps<typeof Button>, 'onClick'> {
  endpoint: 'productUploader' | 'avatarUploader'
  onClientUploadComplete?: (
    res: ClientUploadedFileData<{ uploadedBy: string }>[],
  ) => Promise<void> | void
}

export function UploadButton({
  endpoint,
  onClientUploadComplete,
  ...props
}: UploadButtonProps) {
  const [progress, setProgress] = React.useState(0)
  const { isUploading, startUpload } = useUploadThing((r) => r[endpoint], {
    onUploadBegin: () => {
      setProgress(0)
    },
    onUploadProgress: (progress) => {
      setProgress(progress)
    },
    onClientUploadComplete,
    onUploadError: (error) => {
      console.error(`Upload error for endpoint: ${endpoint}`, error)
      setProgress(0)
    },
  })
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleUpload = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files || files.length === 0) return
      await startUpload(Array.from(files))
    },
    [startUpload],
  )

  return (
    <div>
      <input ref={inputRef} type='file' onChange={handleUpload} hidden />
      <Button
        disabled={isUploading}
        onClick={() => {
          inputRef.current?.click()
        }}
        {...props}
      >
        {isUploading ? `${progress}%` : 'Upload File'}
      </Button>
    </div>
  )
}
