import { useState } from 'react'
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

import { useTRPC } from '@/lib/trpc/react'

export const StaffsList: React.FC = () => {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(trpc.vendor.allStaffs.queryOptions({}))

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
    ...trpc.vendor.removeStaff.mutationOptions(),
    onSuccess: () => {
      toast.success('Vendor status updated successfully')
      setOpen(false)
    },
    onError: ({ message }) =>
      toast.error('Failed to update vendor status', { description: message }),
    meta: { filter: trpc.vendor.allStaffs.queryFilter() },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='text-destructive hover:underline'>
        Remove
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Staff "{username}"?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The staff will lose access to the
            vendor dashboard and all associated resources.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='secondary' disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() => {
              mutate({ staffId })
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
