import { useMutation } from '@tanstack/react-query'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '@yukinu/ui/alert-dialog'
import { Button } from '@yukinu/ui/button'
import { toast } from '@yukinu/ui/toast'
import { useState } from 'react'

import { useTRPC } from '@/lib/trpc'

export const ProductButton: React.FC<{
  productId: string
  productName: string
  type: 'restore' | 'delete' | 'permanentDelete'
  variant: 'default' | 'destructive'
  isAdmin?: boolean
}> = ({ productId, productName, type, variant, isAdmin = false }) => {
  const { trpc } = useTRPC()
  const [isOpen, setIsOpen] = useState(false)

  const label = type
    .replaceAll(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim()

  const mutation = useMutation({
    ...trpc.catalog.product[type].mutationOptions(),
    meta: {
      filter: isAdmin
        ? trpc.catalog.product.all.queryFilter()
        : trpc.catalog.product.allByVendor.queryFilter(),
    },
    onSuccess: () => [
      toast.success({
        message: `Product ${label.toLowerCase()}d successfully`,
      }),
      setIsOpen(false),
    ],
    onError: ({ message }) => toast.error({ message }),
  })

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger render={<Button variant={variant} />}>
        {label}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to {label} product: {productName}?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant={variant}
            onClick={() => mutation.mutate({ id: productId })}
            disabled={mutation.isPending}
          >
            {label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
