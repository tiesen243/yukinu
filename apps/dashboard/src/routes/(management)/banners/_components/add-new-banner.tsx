import { useMutation } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@yukinu/ui/dialog'
import { toast } from '@yukinu/ui/toast'
import { useState } from 'react'

import { UploadInput } from '@/components/upload-input'
import { useTRPC } from '@/lib/trpc'

export const AddNewBanner = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [url, setUrl] = useState('')
  const { trpc } = useTRPC()

  const upload = useMutation({
    ...trpc.sales.banner.create.mutationOptions(),
    meta: { filter: trpc.sales.banner.all.queryFilter() },
    onSuccess: () => [
      toast.success({ message: 'Banner added successfully' }),
      setIsOpen(false),
      setUrl(''),
    ],
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button variant='outline' />}>
        Add new banner
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new banner</DialogTitle>
          <DialogDescription>
            This is where you can add a new banner. You can specify the URL and
            other details for the banner here.
          </DialogDescription>
        </DialogHeader>

        <UploadInput
          endpoint='bannerUploader'
          value={url}
          onValueChange={setUrl}
        />

        <img
          src={url}
          alt='Banner preview'
          className='w-full rounded-lg object-contain'
        />

        <Button
          disabled={!url || upload.isPending}
          onClick={() => upload.mutate({ url })}
        >
          Add banner
        </Button>
      </DialogContent>
    </Dialog>
  )
}
