import type { OurFileRouter } from '@yukinu/uploadthing/config'

import { cn } from '@yukinu/ui'
import { CheckIcon, Loader2Icon, UploadIcon } from '@yukinu/ui/icons'
import { toast } from '@yukinu/ui/toast'
import { useUploadThing } from '@yukinu/uploadthing/react'
import { useCallback, useRef, useState } from 'react'

interface UploadDropzoneProps extends React.HTMLAttributes<HTMLDivElement> {
  endpoint: keyof OurFileRouter
  value: string
  onValueChange: (url: string) => void
  disabled?: boolean
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  endpoint,
  value,
  onValueChange,
  className,
  disabled = false,
  ...props
}) => {
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ut = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      if (res.length <= 0) return

      toast.success({ message: 'Upload successful' })
      for (const r of res) if (r.ufsUrl) onValueChange(r.ufsUrl)
    },
    onUploadError: ({ message }) => {
      toast.error({ message: 'Upload failed', description: message })
    },
  })

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled || ut.isUploading) return
      setIsDragActive(true)
    },
    [disabled, ut.isUploading],
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragActive(false)

      if (disabled || ut.isUploading) return

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = [...e.dataTransfer.files]
        ut.startUpload(files)
      }
    },
    [disabled, ut],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || ut.isUploading) return

      if (e.target.files && e.target.files.length > 0) {
        const files = [...e.target.files]

        const config = ut.routeConfig?.image
        if (!config) return

        if (!files.every((file) => file.type.startsWith('image/')))
          return toast.error({ message: 'Only image files are allowed' })
        if (!files.every((file) => file.size <= 4 * 1024 * 1024))
          return toast.error({ message: 'File size must be less than 4MB' })
        if (files.length > config.maxFileCount)
          return toast.error({
            message: `You can only upload up to ${config.maxFileCount} files`,
          })

        ut.startUpload(files)
      }
    },
    [disabled, ut],
  )

  const onZoneClick = useCallback(() => {
    if (disabled || ut.isUploading) return
    fileInputRef.current?.click()
  }, [disabled, ut.isUploading])

  return (
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={cn(
        'grid place-items-center rounded-lg border',
        isDragActive && 'border-primary bg-primary/10',
        className,
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onZoneClick}
      onDragOver={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      {...props}
    >
      <input
        type='file'
        accept='image/*'
        className='hidden'
        ref={fileInputRef}
        aria-label='File input'
        onChange={handleInputChange}
        disabled={disabled || ut.isUploading}
      />

      <div className='pointer-events-none flex flex-col items-center justify-center gap-2 text-center'>
        {ut.isUploading && (
          <>
            <Loader2Icon className='animate-spin text-muted-foreground' />
            <span className='text-center text-sm text-muted-foreground'>
              Uploading...
            </span>
          </>
        )}

        {!ut.isUploading && !value && (
          <>
            <UploadIcon className='text-muted-foreground' />

            <span className='text-center text-sm text-muted-foreground'>
              {isDragActive ? 'Release to upload' : 'Upload image'}
            </span>
          </>
        )}

        {!ut.isUploading && value && (
          <>
            <CheckIcon className='text-success' />

            <span className='text-center text-sm text-success'>
              File uploaded successfully
            </span>
          </>
        )}
      </div>
    </div>
  )
}
