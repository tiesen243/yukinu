'use client'

import type { AllSessionsOutput } from '@yukinu/validators/auth'

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
import { XIcon } from '@yukinu/ui/icons'
import { toast } from '@yukinu/ui/sonner'

import { useTRPC } from '@/lib/trpc/react'

export const SessionsList: React.FC = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.security.allSessions.queryOptions())

  return data.map((session) => (
    <SessionItem key={session.id} session={session} />
  ))
}

export const SessionsListSkeleton: React.FC = () => {
  return Array.from({ length: 3 }, (_, index) => (
    <div
      key={index}
      className='relative flex animate-pulse flex-col gap-2 border-b pb-4 last:border-0'
    >
      <div className='text-sm text-muted-foreground'>User Agent</div>
      <div className='w-3/4 rounded-md bg-muted'>&nbsp;</div>
      <div className='text-sm text-muted-foreground'>IP Address</div>
      <div className='w-1/2 rounded-md bg-muted'>&nbsp;</div>
      <p className='text-sm text-muted-foreground'>Created At</p>
      <div className='w-1/3 rounded-md bg-muted'>&nbsp;</div>
    </div>
  ))
}

const SessionItem: React.FC<{
  session: AllSessionsOutput[number]
}> = ({ session }) => {
  const trpc = useTRPC()
  const { mutate, isPending } = useMutation({
    ...trpc.security.deleteSession.mutationOptions(),
    meta: { filter: trpc.security.allSessions.queryFilter() },
    onSuccess: () => toast.success('Logged out of session successfully'),
    onError: ({ message }) =>
      toast.error('Failed to log out of session', { description: message }),
  })

  return (
    <div className='relative flex flex-col gap-2 border-b pb-4 last:border-0'>
      <div className='text-sm text-muted-foreground'>User Agent</div>
      <p className='font-mono break-all'>{session.userAgent}</p>
      <div className='text-sm text-muted-foreground'>IP Address</div>
      <p className='font-mono'>{session.ipAddress}</p>
      <p className='text-sm text-muted-foreground'>Created At</p>
      <p className='font-mono'>
        {new Date(session.createdAt).toLocaleString()}
      </p>

      <AlertDialog>
        <AlertDialogTrigger
          className='absolute top-0 right-0'
          variant='outline'
          size='icon-sm'
        >
          <XIcon />
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to log out of this session?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will log you out of the session on the device with IP
              address {session.ipAddress} and user agent &quot;
              {session.userAgent}&quot;. You will need to log in again to access
              your account from that device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant='destructive'
              onClick={() => {
                mutate({ id: session.id })
              }}
              disabled={isPending}
            >
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
