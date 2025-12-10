'use client'

import * as React from 'react'
import Image from 'next/image'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

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
import { MinusIcon, PlusIcon } from '@yukinu/ui/icons'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@yukinu/ui/input-group'
import { toast } from '@yukinu/ui/sonner'
import { TableCell, TableRow } from '@yukinu/ui/table'

import { useTRPC } from '@/lib/trpc/react'

export const CartItemsList: React.FC = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(
    trpc.order.one.queryOptions({ status: 'pending' }),
  )

  return data.items.map((item) => (
    <TableRow key={item.id}>
      <TableCell>
        <div className='flex items-center gap-2'>
          <Image
            src={item.productImage ?? '/assets/logo.svg'}
            alt={`thumbnail of ${item.productName}`}
            className={`size-5 rounded-md object-cover ${item.productImage ? '' : 'dark:invert'}`}
            width={20}
            height={20}
          />
          <span>{item.productName}</span>
        </div>
      </TableCell>
      <TableCell>
        {Object.entries(item.variant).map(([key, value]) => (
          <div key={key}>
            {key}: {value}
          </div>
        ))}
      </TableCell>
      <TableCell className='text-center'>{item.quantity}</TableCell>
      <TableCell className='text-center'>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(parseFloat(item.unitPrice))}
      </TableCell>
      <TableCell className='text-center'>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(parseFloat(item.unitPrice) * item.quantity)}
      </TableCell>
      <TableCell className='space-x-4'>
        <EditButton
          vendorId={item.vendorId}
          productId={item.productId}
          variantId={item.productVariantId}
          unitPrice={item.unitPrice}
          name={item.productName}
          variant={item.variant}
          quantity={item.quantity}
          stock={item.productVariantId ? item.variantStock : item.stock}
        />
        <RemoveButton itemId={item.id} />
      </TableCell>
    </TableRow>
  ))
}

export const CartItemsListSkeleton: React.FC = () =>
  Array.from({ length: 3 }, (_, i) => (
    <TableRow key={i}>
      {Array.from({ length: 6 }, (_, j) => (
        <TableCell key={j}>
          <div className='h-5 w-full animate-pulse rounded-md bg-muted' />
        </TableCell>
      ))}
    </TableRow>
  ))

const EditButton: React.FC<{
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
    ...trpc.order.addItemToCart.mutationOptions(),
    meta: { filter: trpc.order.one.queryFilter({ status: 'pending' }) },
    onSuccess: () => {
      setOpen(false)
      toast.success('Quantity updated successfully')
    },
    onError: ({ message }) =>
      toast.error('Failed to update quantity', { description: message }),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='text-primary underline-offset-4 hover:underline'>
        Edit
      </DialogTrigger>

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
                stock !== null ? localQuantity >= stock || isPending : isPending
              }
              onClick={() => {
                setLocalQuantity((qty) =>
                  stock !== null ? (qty < stock ? qty + 1 : qty) : qty + 1,
                )
              }}
            >
              <PlusIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <DialogFooter>
          <DialogClose disabled={isPending} asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
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

const RemoveButton: React.FC<{ itemId: string | null }> = ({ itemId }) => {
  const [open, setOpen] = React.useState(false)

  const trpc = useTRPC()
  const { mutate, isPending } = useMutation({
    ...trpc.order.removeItemFromCart.mutationOptions(),
    meta: { filter: trpc.order.one.queryFilter({ status: 'pending' }) },
    onSuccess: () => {
      toast.success('Item removed from cart')
      setOpen(false)
    },
    onError: ({ message }) =>
      toast.error('Failed to remove item', { description: message }),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='text-destructive underline-offset-4 hover:underline'>
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
          <DialogClose disabled={isPending} asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button
            variant='destructive'
            disabled={isPending}
            onClick={() => {
              if (!itemId) return
              mutate({ itemId })
            }}
          >
            {isPending ? 'Removing...' : 'Remove'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const CartItemsTotal: React.FC = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(
    trpc.order.one.queryOptions({ status: 'pending' }),
  )

  const total = data.items.reduce((acc, item) => {
    return acc + parseFloat(item.unitPrice) * item.quantity
  }, 0)

  return (
    <TableRow>
      <TableCell colSpan={4} className='text-right font-bold'>
        Total:
      </TableCell>
      <TableCell className='font-bold'>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(total)}
      </TableCell>
      <TableCell className='text-right'>
        <Button variant='outline' size='sm'>
          Checkout
        </Button>
      </TableCell>
    </TableRow>
  )
}

export const CartItemsTotalSkeleton: React.FC = () => (
  <TableRow>
    <TableCell colSpan={4} className='text-right font-bold'>
      Total:
    </TableCell>
    <TableCell className='font-bold'>
      <div className='h-5 animate-pulse rounded-md bg-muted' />
    </TableCell>
    <TableCell className='text-right'>
      <Button variant='outline' size='sm' disabled>
        Checkout
      </Button>
    </TableCell>
  </TableRow>
)
