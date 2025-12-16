'use client'

import Link from 'next/link'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

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
import { Button } from '@yukinu/ui/button'
import { toast } from '@yukinu/ui/sonner'

import { useTRPC } from '@/lib/trpc/react'

export const AddressesList: React.FC = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.user.allAddresses.queryOptions({}))

  if (data.addresses.length === 0)
    return (
      <p className='text-center text-sm text-muted-foreground'>
        No addresses found.
      </p>
    )

  return data.addresses.map((address) => (
    <div
      key={address.id}
      className='relative flex flex-col gap-1 border-b pb-4'
    >
      <div className='flex items-center gap-2 font-medium'>
        <p>{address.recipientName}</p>
        <hr className='h-6 border-l border-muted-foreground' />
        <p className='text-sm text-muted-foreground'>{address.phoneNumber}</p>
      </div>
      <p>{address.street}</p>
      <p>
        {address.city}, {address.state}, {address.country} ({address.postalCode}
        )
      </p>

      <div className='absolute top-0 right-0 grid gap-2'>
        <Button
          variant='outline'
          size='sm'
          nativeButton={false}
          render={<Link href={`/account/address/${address.id}`}>Edit</Link>}
        />
        <DeleteAddressButton id={address.id} />
      </div>
    </div>
  ))
}

export const AddressesListSkeleton: React.FC = () =>
  Array.from({ length: 3 }, (_, i) => (
    <div
      key={i}
      className='relative flex animate-pulse flex-col gap-1 border-b pb-4'
    >
      <div className='h-6 w-1/3 rounded-md bg-muted' />
      <div className='h-6 w-1/4 rounded-md bg-muted' />
      <div className='h-6 w-1/2 rounded-md bg-muted' />
    </div>
  ))

const DeleteAddressButton: React.FC<{ id: string }> = ({ id }) => {
  const trpc = useTRPC()

  const { mutate, isPending } = useMutation({
    ...trpc.user.deleteAddress.mutationOptions(),
    meta: { filter: trpc.user.allAddresses.queryFilter() },
    onSuccess: () => toast.success('Address deleted successfully!'),
    onError: ({ message }) =>
      toast.error('Error deleting address', { description: message }),
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant='destructive' size='sm'>
            Delete
          </Button>
        }
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this address?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            address from your account.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant='destructive'
            onClick={() => {
              mutate({ id })
            }}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
