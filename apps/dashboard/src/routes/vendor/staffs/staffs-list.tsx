import { useMutation, useQuery } from '@tanstack/react-query'
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
import { toast } from '@yukinu/ui/sonner'
import { TableCell, TableRow } from '@yukinu/ui/table'
import { useState } from 'react'

import { useTRPC } from '@/lib/trpc/react'

export const StaffsList: React.FC = () => {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(trpc.vendorStaff.all.queryOptions({}))

  if (isLoading)
    return Array.from({ length: 5 }, (_, index) => (
      <TableRow key={index}>
        {Array.from({ length: 5 }, (_, cellIndex) => (
          <TableCell key={cellIndex}>
            <div className='animate-pulse rounded bg-muted/50'>&nbsp;</div>
          </TableCell>
        ))}
      </TableRow>
    ))

  return data?.map((staff) => (
    <TableRow key={staff.id}>
      <TableCell>{staff.id}</TableCell>
      <TableCell>{staff.username}</TableCell>
      <TableCell>{staff.email}</TableCell>
      <TableCell>{staff.assignedAt.toLocaleDateString()}</TableCell>
      <TableCell>
        <RemoveStaffButton staffId={staff.id} username={staff.username} />
      </TableCell>
    </TableRow>
  ))
}

const RemoveStaffButton: React.FC<{
  staffId: string
  username: string
}> = ({ staffId, username }) => {
  const trpc = useTRPC()
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    ...trpc.vendorStaff.remove.mutationOptions(),
    onSuccess: () => {
      toast.success('Staff member removed successfully')
      setOpen(false)
    },
    onError: ({ message }) =>
      toast.error('Failed to update vendor status', { description: message }),
    meta: { filter: trpc.vendorStaff.all.queryFilter() },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger variant='link' className='text-destructive'>
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
