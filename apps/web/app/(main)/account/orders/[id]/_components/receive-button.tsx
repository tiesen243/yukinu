'use client'

import { useMutation } from '@tanstack/react-query'
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
import { toast } from '@yukinu/ui/toast'
import { useState } from 'react'

import { useTRPC } from '@/lib/trpc'

export const ReceiveButton: React.FC<{ orderId: number }> = ({ orderId }) => {
  const { trpc } = useTRPC()
  const [isOpen, setIsOpen] = useState(false)
  const { mutate, isPending } = useMutation({
    ...trpc.checkout.order.received.mutationOptions(),
    meta: { filter: trpc.checkout.order.one.queryFilter({ id: orderId }) },
    onSuccess: () => {
      toast.success({ message: `Order #${orderId} marked as received` })
      setIsOpen(false)
    },
    onError: ({ message }) => toast.error({ message }),
  })

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger
        render={
          <Button className='bg-success/10 text-success hover:bg-success/20 focus-visible:border-success/40 focus-visible:ring-success/20 dark:bg-success/20 dark:hover:bg-success/30 dark:focus-visible:ring-success/40'>
            Mark as Received
          </Button>
        }
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Did you receive your order?</AlertDialogTitle>
          <AlertDialogDescription>
            Please confirm if order <strong>#{orderId}</strong> has been
            delivered to you safely.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            No, Not Yet
          </AlertDialogCancel>
          <AlertDialogAction
            className='bg-success/10 text-success hover:bg-success/20 focus-visible:border-success/40 focus-visible:ring-success/20 dark:bg-success/20 dark:hover:bg-success/30 dark:focus-visible:ring-success/40'
            onClick={() => mutate({ id: orderId })}
            disabled={isPending}
          >
            {isPending ? 'Updating...' : 'Yes, I Received It'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
