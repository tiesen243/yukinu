'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

import type { RouterOutputs } from '@yuki/api'
import { Badge } from '@yuki/ui/badge'
import { Button } from '@yuki/ui/button'
import { Card } from '@yuki/ui/card'
import { useDebounce } from '@yuki/ui/hooks/use-debounce'
import { MinusIcon, PlusIcon, Trash2Icon } from '@yuki/ui/icons'
import { Input } from '@yuki/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@yuki/ui/select'
import { toast } from '@yuki/ui/sonner'

import { slugify } from '@/lib/utils'
import { useTRPC } from '@/trpc/react'

export const CardList: React.FC = () => {
  const { trpc } = useTRPC()
  const { data: cart } = useSuspenseQuery(trpc.cart.get.queryOptions())
  const { data: addresses } = useSuspenseQuery(trpc.address.all.queryOptions())

  const router = useRouter()
  const [addressId, setAddressId] = useState<string>(
    addresses.find((address) => address.isDefault)?.id ?? '',
  )
  const [paymentMethod, setPaymentMethod] =
    useState<(typeof paymentMethods)[number]>('credit_card')
  const { mutate, isPending } = useMutation({
    ...trpc.order.create.mutationOptions(),
    onSuccess: ({ id }) => {
      toast.success('Order created successfully!')
      router.push(`/account/orders/${id}`)
    },
    onError: ({ message }) => toast.error(message),
  })

  return (
    <section className='grid gap-4'>
      <h3 className='sr-only'>Your Cart Items</h3>

      {cart.items.map((item) => (
        <CartItem key={item.productId} item={item} />
      ))}
      {cart.items.length === 0 ? (
        <div className='text-center text-muted-foreground'>
          Your cart is empty
        </div>
      ) : (
        <div className='grid gap-1 border-t pt-4'>
          <p className='font-semibold'>Total: {cart.totalPrice}</p>
          <p className='text-sm text-muted-foreground'>
            Items: {cart.items.length}
          </p>

          <div className='grid grid-cols-3 gap-4 pt-4'>
            <Select defaultValue={addressId} onValueChange={setAddressId}>
              <SelectTrigger className='line-clamp-1 w-full'>
                <SelectValue placeholder='Select a address' />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {addresses.map((address) => (
                    <SelectItem key={address.id} value={address.id}>
                      <div className='flex flex-col gap-1'>
                        <div className='flex items-center gap-2'>
                          <span className='font-medium'>{address.name}</span>
                          {address.isDefault && (
                            <Badge variant='info' className='py-0'>
                              Default
                            </Badge>
                          )}
                        </div>
                        <span className='text-sm text-muted-foreground'>
                          {address.line1}
                          {address.line2 ? `, ${address.line2}` : ''}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                          {address.city}, {address.state} {address.postalCode}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              defaultValue={paymentMethod}
              onValueChange={(value) => {
                setPaymentMethod(value as (typeof paymentMethods)[number])
              }}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select a payment method' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              className='w-full'
              onClick={() => {
                mutate({
                  addressId,
                  paymentMethod,
                  items: cart.items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                  })),
                })
              }}
              disabled={isPending || !addressId || cart.items.length === 0}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}

const CartItem: React.FC<{
  item: RouterOutputs['cart']['get']['items'][number]
}> = ({ item }) => {
  const [localQuantity, setLocalQuantity] = useState(item.quantity)

  const { trpc, queryClient } = useTRPC()
  const { mutate, isPending } = useMutation({
    ...trpc.cart.update.mutationOptions(),
    onSuccess: () => queryClient.invalidateQueries(trpc.cart.get.queryFilter()),
    onError: () => {
      setLocalQuantity(item.quantity)
    },
  })

  const debouncedUpdate = useDebounce(
    (quantity: number) => {
      mutate({
        productId: item.productId,
        type: 'replace',
        quantity,
      })
    },
    [item.productId],
    500,
  )

  const handleQuantityChange = useCallback(
    (newQuantity: number) => {
      if (
        newQuantity > 0 &&
        newQuantity !== item.quantity &&
        newQuantity <= item.productStock
      ) {
        setLocalQuantity(newQuantity)
        debouncedUpdate(newQuantity)
      }
    },
    [debouncedUpdate, item.productStock, item.quantity],
  )

  return (
    <Card className='w-full flex-row items-center p-4'>
      <Image
        src={item.productImage}
        alt={item.productName}
        width={80}
        height={80}
        className='rounded-md object-cover'
      />

      <Link
        href={`/${slugify(item.productName)}-${item.productId}`}
        className='h-full min-w-0 flex-1'
      >
        <h4 className='line-clamp-1 text-lg font-semibold'>
          {item.productName}
        </h4>
        <p className='line-clamp-2 text-sm text-muted-foreground'>
          ${item.price} each
        </p>
      </Link>

      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => {
            handleQuantityChange(localQuantity - 1)
          }}
          disabled={isPending || item.quantity <= 1}
        >
          <MinusIcon />
        </Button>

        <Input
          type='number'
          value={localQuantity}
          min={1}
          max={item.productStock}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10)
            if (!isNaN(value) && value > 0) handleQuantityChange(value)
          }}
          className='w-16 [appearance:textfield] text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
          disabled={isPending}
        />

        <Button
          variant='outline'
          size='icon'
          onClick={() => {
            handleQuantityChange(localQuantity + 1)
          }}
          disabled={isPending || localQuantity >= item.productStock}
        >
          <PlusIcon />
        </Button>
      </div>

      <div className='min-w-0 text-right'>
        <p className='text-lg font-semibold'>
          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
        </p>
      </div>

      <Button
        variant='ghost'
        size='icon'
        className='text-destructive hover:text-destructive'
        onClick={() => {
          mutate({
            productId: item.productId,
            type: 'remove',
            quantity: 1,
          })
        }}
        disabled={isPending}
      >
        <Trash2Icon />
      </Button>
    </Card>
  )
}

export const CardListSkeleton: React.FC = () => {
  return (
    <section className='grid gap-4'>
      <h3 className='sr-only'>Your Cart Items</h3>

      {Array.from({ length: 3 }, (_, idx) => (
        <CartItemSkeleton key={idx} />
      ))}

      <div className='grid gap-1 border-t pt-4'>
        <p className='font-semibold'>Total: $0.00</p>
        <p className='text-sm text-muted-foreground'>Items: 0</p>

        <div className='grid grid-cols-2 gap-4 pt-4'>
          <div className='h-9 w-full animate-pulse rounded-md bg-current' />
          <div className='h-9 w-full animate-pulse rounded-md bg-current' />
        </div>
      </div>
    </section>
  )
}

const CartItemSkeleton: React.FC = () => {
  return (
    <Card className='w-full flex-row items-center p-4'>
      <div className='size-20 animate-pulse rounded-md bg-current' />

      <div className='h-full min-w-0 flex-1'>
        <h4 className='line-clamp-1 w-40 animate-pulse rounded-md bg-current text-lg font-semibold'>
          &nbsp;
        </h4>
        <p className='line-clamp-2 text-sm text-muted-foreground'>$0.00 each</p>
      </div>

      {/* Quantity Controls */}
      <div className='flex items-center gap-2'>
        <Button variant='outline' size='icon'>
          <MinusIcon />
        </Button>

        <Input
          type='number'
          className='w-16 [appearance:textfield] text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
        />

        <Button variant='outline' size='icon'>
          <PlusIcon />
        </Button>
      </div>

      <div className='min-w-0 text-right'>
        <p className='text-lg font-semibold'>$0.00</p>
      </div>

      <Button
        variant='ghost'
        size='icon'
        className='text-destructive hover:text-destructive'
      >
        <Trash2Icon />
      </Button>
    </Card>
  )
}

const paymentMethods = [
  'credit_card',
  'debit_card',
  'paypal',
  'bank_transfer',
  'cash_on_delivery',
] as const
