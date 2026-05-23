'use client'

import { useMutation } from '@tanstack/react-query'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@yukinu/ui/alert-dialog'
import { Button } from '@yukinu/ui/button'
import { toast } from '@yukinu/ui/toast'
import { useState } from 'react'

import { useTRPC } from '@/lib/trpc'

export const CancelButton: React.FC<{ orderId: number }> = ({ orderId }) => {
  const { trpc } = useTRPC()
  const [isOpen, setIsOpen] = useState(false)
  const { mutate, isPending } = useMutation({
    ...trpc.checkout.order.cancel.mutationOptions(),
    meta: { filter: trpc.checkout.order.one.queryFilter({ id: orderId }) },
    onSuccess: () => {
      toast.success({
        message: `Order #${orderId} has been cancelled successfully.`,
      })
      setIsOpen(false)
    },
    onError: ({ message }) => toast.error({ message }),
  })

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger
        render={<Button variant='destructive'>Cancel Order</Button>}
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to cancel order #{orderId}? This action cannot
            be undone.
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Keep Order</AlertDialogCancel>
          <AlertDialogAction
            variant='destructive'
            onClick={() => mutate({ id: orderId })}
            disabled={isPending}
          >
            {isPending ? 'Cancelling...' : 'Cancel Order'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
