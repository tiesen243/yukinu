import { useMutation } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@yukinu/ui/dialog'
import { toast } from '@yukinu/ui/toast'
import * as React from 'react'

import { useTRPC } from '@/lib/trpc'

export const RemoveButton: React.FC<{ itemId: string | null }> = ({
  itemId,
}) => {
  const [open, setOpen] = React.useState(false)

  const { trpc } = useTRPC()
  const { mutate, isPending } = useMutation({
    ...trpc.sales.cart.remove.mutationOptions(),
    meta: { filter: trpc.sales.cart.get.queryFilter() },
    onSuccess: () => {
      toast.success({ message: 'Item removed from cart' })
      setOpen(false)
    },
    onError: ({ message }) => toast.error({ message }),
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
          <DialogTitle>Remove item from cart</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this item from your cart?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose disabled={isPending}>Cancel</DialogClose>
          <Button
            variant='destructive'
            disabled={isPending}
            onClick={() => {
              if (!itemId) return
              mutate({ cartItemId: itemId })
            }}
          >
            {isPending ? 'Removing...' : 'Remove'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
