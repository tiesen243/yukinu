'use client'

import type * as React from 'react'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

import type { AddressModels } from '@yukinu/validators/address'
import { Badge } from '@yukinu/ui/badge'
import { Button } from '@yukinu/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@yukinu/ui/dialog'
import { toast } from '@yukinu/ui/sonner'

import { useTRPC } from '@/trpc/react'

export const AddressList: React.FC = () => {
  const trpc = useTRPC()
  const {
    data: { addresses },
  } = useSuspenseQuery(trpc.address.all.queryOptions({}))

  return (
    <section className='px-4'>
      <h4 className='sr-only'>Address List</h4>

      <ul className='flex flex-col gap-4 divide-y divide-border'>
        {addresses.map((address) => (
          <AddressItem key={address.id} address={address} />
        ))}
      </ul>
    </section>
  )
}

const AddressItem: React.FC<{
  address: AddressModels.AllOutput['addresses'][number]
}> = ({ address }) => {
  const trpc = useTRPC()

  const update = useMutation({
    ...trpc.address.update.mutationOptions(),
    meta: { filter: trpc.address.all.queryFilter() },
    onSuccess: () => toast.success('Address updated successfully'),
    onError: ({ message }) => toast.error(message),
  })

  const remove = useMutation({
    ...trpc.address.delete.mutationOptions(),
    meta: { filter: trpc.address.all.queryFilter() },
    onSuccess: () => toast.success('Address deleted successfully'),
    onError: ({ message }) => toast.error(message),
  })

  return (
    <li className='grid auto-rows-min grid-rows-[1fr_auto] items-start gap-2 pb-4 last:pb-0'>
      <div className='flex items-center gap-2 divide-x divide-border'>
        <p className='pr-2 font-medium'>{address.recipientName}</p>
        <p className='text-sm text-muted-foreground'>{address.phoneNumber}</p>
      </div>

      <div>
        <p>{address.street}</p>
        <p>
          {address.city}, {address.state}, {address.postalCode}
        </p>
        <p>{address.country}</p>
      </div>

      <div className='flex items-center justify-between'>
        {address.isDefault ? (
          <Badge variant='outline' className='h-8 rounded-md border-primary'>
            Default
          </Badge>
        ) : (
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              update.mutate({ id: address.id, isDefault: true })
            }}
            disabled={update.isPending}
          >
            Set as Default
          </Button>
        )}
      </div>

      <div className='col-start-2 row-span-2 row-start-1 flex gap-2 self-start justify-self-end'>
        <Button variant='link' size='sm'>
          Edit
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='link' size='sm' className='text-destructive'>
              Delete
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Address</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this address? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>

            <div className='mt-4 flex justify-end gap-2'>
              <DialogClose asChild>
                <Button variant='secondary'>Cancel</Button>
              </DialogClose>

              <DialogClose asChild>
                <Button
                  variant='destructive'
                  onClick={() => {
                    remove.mutate({ id: address.id })
                  }}
                  disabled={remove.isPending}
                >
                  Delete
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </li>
  )
}

export const AddressListSkeleton: React.FC = () => {
  return (
    <section className='px-4'>
      <h4 className='sr-only'>Address List</h4>
      <ul></ul>
    </section>
  )
}
