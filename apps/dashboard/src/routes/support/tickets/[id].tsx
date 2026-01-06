import type { Route } from './+types/[id]'

import { useMutation, useQuery } from '@tanstack/react-query'
import { cn } from '@yukinu/ui'
import { Badge } from '@yukinu/ui/badge'
import { Button } from '@yukinu/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@yukinu/ui/dialog'
import { Label } from '@yukinu/ui/label'
import { RadioGroup, RadioGroupItem } from '@yukinu/ui/radio-group'
import { toast } from '@yukinu/ui/sonner'
import { Typography } from '@yukinu/ui/typography'
import { ticketStatuses } from '@yukinu/validators/general'
import * as React from 'react'

import { useTRPC } from '@/lib/trpc/react'

export default function SupportTicketDetails({ params }: Route.ComponentProps) {
  const trpc = useTRPC()

  const { data, isLoading } = useQuery(trpc.ticket.one.queryOptions(params))
  const { mutate, isPending } = useMutation({
    ...trpc.ticket.updateStatus.mutationOptions(),
    meta: { filter: trpc.ticket.all.queryFilter() },
    onSuccess: () => toast.success('Ticket status updated successfully'),
    onError: ({ message }) =>
      toast.error('Failed to update ticket status', { description: message }),
  })

  const [open, setOpen] = React.useState(false)
  const [status, setStatus] = React.useState(data?.status)

  if (isLoading || !data) return <div>Loading...</div>

  return (
    <>
      <div className='flex my-6 items-center gap-4'>
        <Typography variant='h2' className='mb-0'>
          {data.subject}
        </Typography>
        <Badge
          variant={
            data.status === 'open'
              ? 'info'
              : data.status === 'closed'
                ? 'destructive'
                : 'success'
          }
        >
          {data.status}
        </Badge>
      </div>
      <div className='flex items-center justify-between'>
        <div>
          <Typography className='text-muted-foreground'>
            Ticket ID: {data.id}
          </Typography>
          <Typography className='text-muted-foreground'>
            User ID: {data.userId}
          </Typography>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>Update Status</DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Ticket Status</DialogTitle>
              <DialogDescription>
                Change the status of the support ticket.
              </DialogDescription>
            </DialogHeader>

            <RadioGroup value={status} onValueChange={setStatus as never}>
              {ticketStatuses.map((status) => (
                <Label
                  key={status}
                  htmlFor={status}
                  className={cn(
                    'flex cursor-pointer items-center space-x-2 rounded-md border border-current/40 bg-current/5 px-2 py-4 capitalize transition-colors hover:bg-current/10',
                    {
                      'text-primary': status === 'open',
                      'text-destructive': status === 'closed',
                      'text-success': status === 'resolved',
                    },
                  )}
                >
                  <RadioGroupItem id={status} value={status} /> {status}
                </Label>
              ))}
            </RadioGroup>

            <DialogFooter>
              <DialogClose disabled={isPending}>Cancel</DialogClose>
              <Button
                onClick={() => mutate({ id: data.id, status })}
                disabled={isPending}
              >
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <hr className='my-4' />

      <Typography>{data?.description}</Typography>
    </>
  )
}
