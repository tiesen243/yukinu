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
import { toast } from '@yukinu/ui/toast'
import * as React from 'react'

import { useTRPC } from '@/lib/trpc'

export const EditButton: React.FC<{
  productId: string
  productVariantId: string | null
  name: string
  variant: Record<string, string>
  stock: number
  quantity: number
}> = ({ productId, productVariantId, name, variant, stock, quantity }) => {
  const [localQuantity, setLocalQuantity] = React.useState(quantity)
  const [open, setOpen] = React.useState(false)

  const { trpc } = useTRPC()
  const { mutate, isPending } = useMutation({
    ...trpc.sales.cart.save.mutationOptions(),
    meta: { filter: trpc.sales.cart.get.queryFilter() },
    onSuccess: () => {
      toast.success({ message: 'Quantity updated successfully' })
      setOpen(false)
    },
    onError: ({ message }) => toast.error({ message }),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant='link' />}>Edit</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit quantity of {name}</DialogTitle>
          <DialogDescription>
            {Object.entries(variant).map(([key, value]) => (
              <span key={key} className='block'>
                {key}: {value}
              </span>
            ))}
            <span>In stock: {stock}</span>
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
              const value = Number.parseInt(e.target.value, 10)
              if (Number.isNaN(value) || value < 1 || value > stock) return
              setLocalQuantity(value)
            }}
          />
          <InputGroupAddon align='inline-end'>
            <InputGroupButton
              disabled={localQuantity >= stock || isPending}
              onClick={() => {
                setLocalQuantity((qty) => {
                  if (stock === null) return qty + 1
                  if (qty < stock) return qty + 1
                  return qty
                })
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
            disabled={isPending || localQuantity > stock || localQuantity < 1}
            onClick={() =>
              mutate({ productId, productVariantId, quantity: localQuantity })
            }
          >
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
