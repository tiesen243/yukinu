import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@yukinu/ui/dialog'
import { PlusIcon, TrashIcon } from '@yukinu/ui/icons'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@yukinu/ui/input-group'
import { toast } from '@yukinu/ui/sonner'
import { Typography } from '@yukinu/ui/typography'
import * as React from 'react'

import { InputGroupUploadButton } from '@/components/input-group-upload-button'
import { useTRPC } from '@/lib/trpc/react'

export default function BannersPage() {
  const trpc = useTRPC()
  const { data, isPending } = useQuery(trpc.banner.all.queryOptions())

  return (
    <>
      <Typography variant='h2'>Banners Management</Typography>
      <Typography className='text-muted-foreground'>
        Manage and view all banners in the system.
      </Typography>

      <AddBannerButton />

      <Card className='px-4' render={<ul />}>
        {isPending && <li>Loading banners...</li>}
        {data?.map((banner) => (
          <Banner key={banner.id} id={banner.id} url={banner.url} />
        ))}
      </Card>
    </>
  )
}

const Banner: React.FC<{ id: string; url: string }> = ({ id, url }) => {
  const trpc = useTRPC()
  const { mutate, isPending } = useMutation({
    ...trpc.banner.delete.mutationOptions(),
    meta: { filter: trpc.banner.all.queryFilter() },
  })

  return (
    <InputGroup render={<li />}>
      <InputGroupInput value={url} readOnly />
      <InputGroupAddon align='inline-end'>
        <InputGroupButton onClick={() => mutate({ id })} disabled={isPending}>
          <TrashIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

const AddBannerButton: React.FC = () => {
  const [open, setOpen] = React.useState(false)
  const [url, setUrl] = React.useState('')
  const trpc = useTRPC()

  const { mutate, isPending } = useMutation({
    ...trpc.banner.create.mutationOptions(),
    meta: { filter: trpc.banner.all.queryFilter() },
    onSuccess: () => {
      toast.success('Banner added successfully')
      setOpen(false)
      setUrl('')
    },
    onError: ({ message }) =>
      toast.error('Error adding banner', { description: message }),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='my-4 self-end'>
        <PlusIcon data-icon='inline-start' /> Add New Banner
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Banner</DialogTitle>

          <InputGroup className='mt-4'>
            <InputGroupInput
              placeholder='Banner Image URL'
              type='url'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isPending}
            />
            <InputGroupAddon align='inline-end'>
              <InputGroupUploadButton
                endpoint='bannerUploader'
                onUploadComplete={(url) => setUrl(url)}
              />
            </InputGroupAddon>
          </InputGroup>
        </DialogHeader>

        <img
          src={url}
          alt='Banner Preview'
          className='max-h-48 w-full object-cover rounded-md'
        />

        <DialogFooter>
          <DialogClose disabled={isPending}>Cancel</DialogClose>
          <Button onClick={() => mutate({ url })} disabled={isPending || !url}>
            Add Banner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
