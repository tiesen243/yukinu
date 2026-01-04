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
import { MinusIcon, PlusIcon } from '@yukinu/ui/icons'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@yukinu/ui/input-group'
import { toast } from '@yukinu/ui/sonner'
import * as React from 'react'

import { useTRPC } from '@/lib/trpc/react'

export const EditButton: React.FC<{
  vendorId: string | null
  productId: string | null
  variantId: string | null
  unitPrice: string
  name: string | null
  variant: Record<string, string>
  quantity: number
  stock: number | null
}> = ({
  vendorId,
  productId,
  variantId,
  unitPrice,
  name,
  variant,
  quantity,
  stock,
}) => {
  const [localQuantity, setLocalQuantity] = React.useState(quantity)
  const [open, setOpen] = React.useState(false)

  const trpc = useTRPC()
  const { mutate, isPending } = useMutation({
    ...trpc.cart.addItemToCart.mutationOptions(),
    meta: { filter: trpc.cart.get.queryFilter() },
    onSuccess: () => {
      setOpen(false)
      toast.success('Quantity updated successfully')
    },
    onError: ({ message }) =>
      toast.error('Failed to update quantity', { description: message }),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger variant='link'>Edit</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit quantity of {name}</DialogTitle>
          <DialogDescription>
            {Object.entries(variant).map(([key, value]) => (
              <span key={key} className='block'>
                {key}: {value}
              </span>
            ))}
            <span>In stock: {stock ?? '∞'}</span>
          </DialogDescription>
        </DialogHeader>

        <InputGroup>
          <InputGroupAddon align='inline-start'>
            <InputGroupButton
              disabled={localQuantity <= 1 || isPending}
              onClick={() => {
                setLocalQuantity((qty) => (qty > 1 ? qty - 1 : qty))
              }}
            >
              <MinusIcon />
            </InputGroupButton>
          </InputGroupAddon>
          <InputGroupInput
            type='number'
            disabled={isPending}
            className='[appearance:textfield]'
            value={localQuantity}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10)
              if (
                isNaN(value) ||
                value < 1 ||
                (stock !== null && value > stock)
              )
                return
              setLocalQuantity(value)
            }}
          />
          <InputGroupAddon align='inline-end'>
            <InputGroupButton
              disabled={
                stock === null ? isPending : localQuantity >= stock || isPending
              }
              onClick={() => {
                setLocalQuantity((qty) =>
                  stock === null ? qty + 1 : qty < stock ? qty + 1 : qty,
                )
              }}
            >
              <PlusIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <DialogFooter>
          <DialogClose
            render={
              <Button variant='outline' disabled={isPending}>
                Cancel
              </Button>
            }
          />
          <Button
            disabled={isPending}
            onClick={() => {
              if (!productId) return

              mutate({
                vendorId,
                productId,
                unitPrice,
                quantity: localQuantity,
                variantId: variantId ?? undefined,
              })
            }}
          >
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
