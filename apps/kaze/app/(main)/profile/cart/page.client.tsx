'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

import type { RouterOutputs } from '@yuki/api'
import { Badge } from '@yuki/ui/badge'
import { Button } from '@yuki/ui/button'
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

import { slugify } from '@/lib/utils'
import { useTRPC } from '@/trpc/react'

export const CardList: React.FC = () => {
  const { trpc } = useTRPC()
  const { data: cart } = useSuspenseQuery(trpc.cart.get.queryOptions())
  const { data: addresses } = useSuspenseQuery(trpc.address.all.queryOptions())

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        {cart.items.map((item) => (
          <CartItem key={item.productId} item={item} />
        ))}
      </div>

      {cart.items.length === 0 ? (
        <div className="text-muted-foreground text-center">
          Your cart is empty
        </div>
      ) : (
        <div className="grid gap-1 border-t pt-4">
          <p className="font-semibold">Total: {cart.totalPrice}</p>
          <p className="text-muted-foreground text-sm">
            Items: {cart.items.length}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <Select
              defaultValue={addresses.find((address) => address.isDefault)?.id}
            >
              <SelectTrigger className="line-clamp-1 w-full">
                <SelectValue placeholder="Select a address" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {addresses.map((address) => (
                    <SelectItem key={address.id} value={address.id}>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{address.name}</span>
                          {address.isDefault && (
                            <Badge variant="info" className="py-0">
                              Default
                            </Badge>
                          )}
                        </div>
                        <span className="text-muted-foreground text-sm">
                          {address.line1}
                          {address.line2 ? `, ${address.line2}` : ''}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {address.city}, {address.state} {address.postalCode}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button className="w-full">Checkout</Button>
          </div>
        </div>
      )}
    </div>
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

  const debouncedUpdate = useDebounce((quantity: number) => {
    if (quantity !== item.quantity && quantity > 0) {
      mutate({
        productId: item.productId,
        type: 'replace',
        quantity,
      })
    }
  }, 500)

  const handleQuantityChange = useCallback(
    (newQuantity: number) => {
      if (newQuantity > 0) {
        setLocalQuantity(newQuantity)
        debouncedUpdate(newQuantity)
      }
    },
    [debouncedUpdate],
  )

  return (
    <div className="bg-card hover:bg-card/80 grid grid-cols-7 gap-4 rounded-xl border p-4 shadow-md transition-colors">
      <Link href={`/${slugify(item.productName)}-${item.productId}`}>
        <Image
          src={item.productImage}
          alt={item.productName}
          className="aspect-square rounded-md object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          width={80}
          height={80}
        />
        <span className="sr-only">View details for {item.productName}</span>
      </Link>

      <div className="col-span-5 grid gap-2">
        <h3 className="text-lg font-semibold">{item.productName}</h3>

        <div className="flex">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => {
              if (localQuantity > 1) handleQuantityChange(localQuantity - 1)
            }}
            disabled={isPending}
          >
            <MinusIcon />
          </Button>

          <Input
            type="number"
            className="mx-2 h-8 w-16 [appearance:textfield] text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            value={localQuantity}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10)
              if (value > 0) handleQuantityChange(value)
            }}
            disabled={isPending}
          />
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => {
              handleQuantityChange(localQuantity + 1)
            }}
            disabled={isPending}
          >
            <PlusIcon />
          </Button>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="text-right font-semibold">
          ${(item.price * localQuantity).toFixed(2)}
        </p>

        <Button
          variant="ghost"
          className="text-destructive"
          disabled={isPending}
          onClick={() => {
            mutate({
              productId: item.productId,
              type: 'remove',
              quantity: 1,
            })
          }}
        >
          <Trash2Icon /> Remove
        </Button>
      </div>
    </div>
  )
}

export const CardListSkeleton: React.FC = () => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        {Array.from({ length: 3 }, (_, idx) => (
          <CartItemSkeleton key={idx} />
        ))}
      </div>

      <div className="grid gap-1 border-t pt-4">
        <p className="font-semibold">Total: $0</p>
        <p className="text-muted-foreground text-sm">Items:0</p>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="h-9 w-full animate-pulse rounded-md bg-current" />
          <div className="h-9 w-full animate-pulse rounded-md bg-current" />
        </div>
      </div>
    </div>
  )
}

const CartItemSkeleton: React.FC = () => {
  return (
    <div className="bg-card grid grid-cols-7 gap-4 rounded-xl border p-4 shadow-md">
      <div className="aspect-square h-20 w-20 animate-pulse rounded-md bg-current" />

      <div className="col-span-5 grid gap-2">
        <div className="h-6 w-3/4 animate-pulse rounded-md bg-current" />

        <div className="flex">
          <div className="size-8 animate-pulse rounded-md bg-current" />
          <div className="mx-2 h-8 w-16 animate-pulse rounded-md bg-current" />
          <div className="size-8 animate-pulse rounded-md bg-current" />
        </div>
      </div>

      <div className="grid gap-2">
        <div className="h-6 w-20 animate-pulse rounded-md bg-current" />
        <div className="h-9 w-20 animate-pulse rounded-md bg-current" />
      </div>
    </div>
  )
}
