import { useMutation, useQuery } from '@tanstack/react-query'
import { formatDate } from '@yukinu/lib/utils'
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
import { TableCell, TableRow } from '@yukinu/ui/table'
import { toast } from '@yukinu/ui/toast'
import { useState } from 'react'

import { useTRPC } from '@/lib/trpc/react'

export const StaffsList: React.FC = () => {
  const { trpc } = useTRPC()
  const { data, isLoading } = useQuery(trpc.merchant.staff.all.queryOptions({}))

  if (isLoading)
    return Array.from({ length: 5 }, (_, index) => (
      <TableRow key={index}>
        {Array.from({ length: 5 }, (__, cellIndex) => (
          <TableCell key={cellIndex}>
            <div className='animate-pulse rounded bg-muted/50'>&nbsp;</div>
          </TableCell>
        ))}
      </TableRow>
    ))

  return data?.map((staff) => (
    <TableRow key={staff.userId}>
      <TableCell>{staff.userId}</TableCell>
      <TableCell>{staff.username}</TableCell>
      <TableCell>{staff.email}</TableCell>
      <TableCell>{formatDate(staff.assignedAt)}</TableCell>
      <TableCell>
        <RemoveStaffButton staffId={staff.userId} username={staff.username} />
      </TableCell>
    </TableRow>
  ))
}

const RemoveStaffButton: React.FC<{
  staffId: string
  username: string
}> = ({ staffId, username }) => {
  const { trpc } = useTRPC()
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    ...trpc.merchant.staff.remove.mutationOptions(),
    onSuccess: () => {
      toast.add({
        type: 'success',
        title: 'Staff member removed successfully!',
        description: `The staff member "${username}" has been removed from your vendor.`,
      })
      setOpen(false)
    },
    onError: ({ message }) =>
      toast.add({
        type: 'error',
        title: 'Failed to remove staff member.',
        description: message,
      }),
    meta: { filter: trpc.merchant.staff.all.queryFilter() },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant='link' className='text-destructive' />}
      >
        Remove
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Staff &quot;{username}&quot;?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The staff will lose access to the
            vendor dashboard and all associated resources.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose disabled={isPending}>Cancel</DialogClose>
          <Button
            onClick={() => {
              mutate({ userId: staffId })
            }}
            disabled={isPending}
          >
            {isPending ? 'Removing...' : 'Remove Staff'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
