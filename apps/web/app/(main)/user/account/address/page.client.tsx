'use client'

import type { Route } from 'next'
import type * as React from 'react'
import Link from 'next/link'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

import type { AddressModels } from '@yukinu/validators/address'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@yukinu/ui/alert-dialog'
import { Badge } from '@yukinu/ui/badge'
import { Button } from '@yukinu/ui/button'
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
    onSuccess: () => toast.success('Set as default address successfully'),
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

      {address.isDefault ? (
        <Badge
          variant='outline'
          className='h-8 rounded-md border-primary bg-primary/10 text-primary'
        >
          Default
        </Badge>
      ) : (
        <Button
          variant='outline'
          size='sm'
          className='w-fit'
          onClick={() => {
            update.mutate({ id: address.id, isDefault: true })
          }}
          disabled={update.isPending}
        >
          Set as Default
        </Button>
      )}

      <div className='col-start-2 row-span-2 row-start-1 flex gap-2 self-start justify-self-end'>
        <Button variant='link' size='sm' asChild>
          <Link href={`/user/account/address/${address.id}` as Route}>
            Edit
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='link' size='sm' className='text-destructive'>
              Delete
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Address</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this address? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                onClick={() => {
                  remove.mutate({ id: address.id })
                }}
                disabled={remove.isPending}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  )
}

export const AddressListSkeleton: React.FC = () => (
  <section className='px-4'>
    <h4 className='sr-only'>Address List</h4>
    <ul className='flex flex-col gap-4 divide-y divide-border'>
      {Array.from({ length: 3 }, (_, index) => (
        <AddressItemSkeleton key={index} />
      ))}
    </ul>
  </section>
)

const AddressItemSkeleton: React.FC = () => (
  <li className='grid auto-rows-min grid-rows-[1fr_auto] items-start gap-2 pb-4 last:pb-0'>
    <div className='w-1/2 animate-pulse rounded-sm bg-current'>&nbsp;</div>

    <div>
      <p className='w-1/3 animate-pulse rounded-sm bg-current'>&nbsp;</p>
      <p className='w-1/4 animate-pulse rounded-sm bg-current'>&nbsp;</p>
      <p className='w-1/5 animate-pulse rounded-sm bg-current'>&nbsp;</p>
    </div>

    <Button variant='outline' size='sm' className='w-fit' disabled>
      Set as Default
    </Button>

    <div className='col-start-2 row-span-2 row-start-1 flex gap-2 self-start justify-self-end'>
      <Button variant='link' size='sm'>
        Edit
      </Button>
      <Button variant='link' size='sm' className='text-destructive'>
        Delete
      </Button>
    </div>
  </li>
)
