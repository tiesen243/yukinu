import type { AllVouchersOutput } from '@yukinu/validators/general'

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
import { TableCell, TableRow } from '@yukinu/ui/table'
import { toast } from '@yukinu/ui/toast'
import { useState } from 'react'
import { Link } from 'react-router'

import { useTRPC } from '@/lib/trpc/react'
import { useVoucherQueryStates } from '@/routes/admin/vouchers/_components/hook'

export const VouchersList: React.FC = () => {
  const trpc = useTRPC()
  const [query] = useVoucherQueryStates()

  const { data, isLoading } = useQuery(trpc.voucher.all.queryOptions(query))

  if (isLoading)
    return Array.from({ length: 5 }, (_, index) => (
      <TableRow key={index}>
        {Array.from({ length: 6 }, (__, cellIndex) => (
          <TableCell key={cellIndex}>
            <div className='animate-pulse rounded bg-muted/50'>&nbsp;</div>
          </TableCell>
        ))}
      </TableRow>
    ))

  return data?.vouchers.map((voucher) => (
    <TableRow key={voucher.id}>
      <TableCell>{voucher.code}</TableCell>
      <TableCell>{voucher.discountAmount}</TableCell>
      <TableCell>{voucher.discountPercentage}</TableCell>
      <TableCell>{voucher.quantity}</TableCell>
      <TableCell>{voucher.expiryDate.toLocaleDateString()}</TableCell>
      <TableCell className='space-x-2'>
        <Link
          to={`/admin/vouchers/${voucher.id}`}
          className='text-primary underline-offset-4 hover:underline'
        >
          Edit
        </Link>
        <DeleteVoucherButton voucher={voucher} />
      </TableCell>
    </TableRow>
  ))
}

const DeleteVoucherButton: React.FC<{
  voucher: AllVouchersOutput['vouchers'][number]
}> = ({ voucher }) => {
  const trpc = useTRPC()
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    ...trpc.voucher.delete.mutationOptions(),
    onSuccess: () => {
      toast.add({
        type: 'success',
        title: 'Voucher deleted successfully',
      })
      setOpen(false)
    },
    onError: ({ message }) =>
      toast.add({
        type: 'error',
        title: 'Failed to delete voucher',
        description: message,
      }),
    meta: { filter: trpc.voucher.all.queryFilter() },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant='link' className='text-destructive' />}
      >
        Delete
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Voucher</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the voucher &quot;{voucher.code}
            &quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose disabled={isPending}>Cancel</DialogClose>
          <Button
            variant='destructive'
            disabled={isPending}
            onClick={() => {
              mutate({ id: voucher.id })
            }}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
