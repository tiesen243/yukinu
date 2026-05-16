import type { OurFileRouter } from '@yukinu/uploadthing/config'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@yukinu/ui/input-group'
import { toast } from '@yukinu/ui/toast'
import { useUploadThing } from '@yukinu/uploadthing/react'
import { useRef } from 'react'

export const UploadInput: React.FC<
  {
    endpoint: keyof OurFileRouter
    value: string
    onValueChange: (url: string) => void
    disabled?: boolean
  } & React.ComponentPropsWithoutRef<typeof InputGroup>
> = ({ endpoint, value, onValueChange, disabled = false, ...props }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const ut = useUploadThing(endpoint, {
    onClientUploadComplete: ([res]) => {
      if (res?.ufsUrl) {
        toast.success({ message: 'Upload successful' })
        onValueChange(res.ufsUrl)
      } else toast.error({ message: 'Failed to upload' })
    },
    onUploadError: ({ message }) => {
      toast.error({ message: 'Upload failed', description: message })
    },
  })

  return (
    <InputGroup {...props}>
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
        disabled={disabled || ut.isUploading}
        hidden
      />

      <InputGroupInput
        value={ut.isUploading ? 'Uploading...' : value}
        placeholder='No file selected'
        disabled={disabled || ut.isUploading}
        aria-label='File URL'
        aria-invalid={props['aria-invalid']}
        aria-describedby={props['aria-describedby']}
        readOnly
      />

      <InputGroupAddon align='inline-end'>
        <InputGroupButton
          disabled={disabled || ut.isUploading}
          onClick={() => inputRef.current?.click()}
        >
          Upload
        </InputGroupButton>
      </InputGroupAddon>

      {props.children}
    </InputGroup>
  )
}
