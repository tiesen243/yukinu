'use client'

import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import { CheckCircle2Icon, TagIcon } from '@yukinu/ui/icons'
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from '@yukinu/ui/input-group'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@yukinu/ui/item'
import { RadioGroup, RadioGroupItem } from '@yukinu/ui/radio-group'
import { toast } from '@yukinu/ui/toast'
import Image from 'next/image'
import { useMemo, useState } from 'react'

import { usePage } from '@/app/(main)/account/cart/checkout/page.provider'
import { SHIPPING_COST, TAX_RATE } from '@/lib/constants'
import { useTRPC } from '@/lib/trpc/react'
import { formatPrice } from '@/lib/utils'

export const OrderItems: React.FC = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.cart.get.queryOptions({}))

  return data.items.map((item) => (
    <Item
      key={item.id}
      variant='outline'
      className='hover:bg-muted dark:hover:bg-muted/50'
    >
      <ItemMedia variant='image'>
        <Image
          src={item.productImage ?? '/favicon.svg'}
          alt={item.productName}
          className='h-20 w-20 rounded-md object-cover'
          width={80}
          height={80}
        />
      </ItemMedia>
      <ItemContent className='flex-1'>
        <ItemTitle>{item.productName}</ItemTitle>
        <ItemDescription>
          {item.variant
            ? Object.entries(item.variant as Record<string, string>)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ')
            : null}
        </ItemDescription>
      </ItemContent>

      <ItemContent className='flex flex-col items-end'>
        <ItemTitle className='text-lg text-primary'>
          {formatPrice(Number.parseFloat(item.productPrice) * item.quantity)}
        </ItemTitle>
        <ItemDescription>
          {formatPrice(item.productPrice)} × {item.quantity}
        </ItemDescription>
      </ItemContent>
    </Item>
  ))
}

export function AddressSelector() {
  const trpc = useTRPC()
  const {
    data: { addresses },
  } = useSuspenseQuery(trpc.address.all.queryOptions({}))
  const { addressId, setAddressId } = usePage()

  return addresses.map((address) => (
    <label
      key={address.id}
      htmlFor={`addr-${address.id}`}
      className='relative flex cursor-pointer items-start gap-4 rounded-lg border border-border p-4 transition-all hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5'
    >
      <RadioGroup
        className='w-fit'
        value={addressId}
        onValueChange={setAddressId}
      >
        <RadioGroupItem value={address.id} id={`addr-${address.id}`} />
      </RadioGroup>
      <div className='-mt-1 min-w-0 flex-1'>
        <p className='block cursor-pointer text-sm font-medium text-foreground'>
          {address.recipientName}
        </p>
        <p className='mt-2 text-xs leading-relaxed text-muted-foreground'>
          {address.street} <br />
          {address.city}, {address.state} {address.postalCode}
        </p>
      </div>
    </label>
  ))
}

export function PaymentMethodSelector() {
  const { paymentMethod, setPaymentMethod } = usePage()

  const methods = [
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Transfer directly from your bank account',
    },
    {
      id: 'cash_on_delivery',
      name: 'Cash on Delivery',
      description: 'Pay with cash upon delivery',
    },
  ]

  return methods.map((method) => (
    <label
      key={method.id}
      htmlFor={`payment-${method.id}`}
      className='relative flex cursor-pointer items-start gap-4 rounded-lg border border-border p-4 transition-all hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5'
    >
      <RadioGroup
        className='w-fit'
        value={paymentMethod}
        onValueChange={setPaymentMethod}
      >
        <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
      </RadioGroup>
      <div className='-mt-1 min-w-0 flex-1'>
        <p className='block cursor-pointer text-sm font-medium text-foreground'>
          {method.name}
        </p>
        <p className='mt-1 text-xs text-muted-foreground'>
          {method.description}
        </p>
      </div>
    </label>
  ))
}

export function DiscountCodeInput() {
  const [code, setCode] = useState('')
  const { setVoucher } = usePage()
  const trpc = useTRPC()

  const { mutate, isPending } = useMutation({
    ...trpc.voucher.use.mutationOptions(),
    onSuccess: ({ discountAmount, discountPercentage }) => {
      setVoucher({ discountAmount, discountPercentage })
      toast.add({
        type: 'success',
        title: 'Voucher applied!',
        description: `You got a ${discountAmount ? formatPrice(discountAmount) : `${discountPercentage}%`} discount!`,
      })
    },
    onError: ({ message }) =>
      toast.add({
        type: 'error',
        title: 'Apply voucher failed',
        description: message,
      }),
  })

  return (
    <div className='flex flex-col gap-2 sm:flex-row'>
      <InputGroup className='flex-1'>
        <InputGroupInput
          placeholder='Enter voucher or discount code'
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <InputGroupAddon>
          <TagIcon />
        </InputGroupAddon>
      </InputGroup>
      <Button
        onClick={() => mutate({ code })}
        disabled={code.trim().length <= 3 || isPending}
      >
        {isPending ? 'Applying...' : 'Apply'}
      </Button>
    </div>
  )
}

export function Checkout() {
  const trpc = useTRPC()
  const {
    data: { totalAmount },
  } = useSuspenseQuery(trpc.cart.get.queryOptions({}))
  const { voucher, addressId, paymentMethod } = usePage()

  const appliedDiscount = useMemo(() => {
    if (voucher.discountAmount) return Number.parseFloat(voucher.discountAmount)
    if (voucher.discountPercentage)
      return (voucher.discountPercentage / 100) * Number.parseFloat(totalAmount)
    return 0
  }, [voucher, totalAmount])

  const finalAmount = useMemo(() => {
    let amount = Number.parseFloat(totalAmount) - appliedDiscount
    amount += TAX_RATE * amount + SHIPPING_COST
    return Math.max(amount, 0)
  }, [totalAmount, appliedDiscount])

  return (
    <>
      <div className='mb-6 space-y-4'>
        <div className='flex justify-between text-sm'>
          <span className='text-muted-foreground'>Subtotal</span>
          <span className='font-medium text-foreground'>
            {formatPrice(totalAmount)}
          </span>
        </div>

        {appliedDiscount > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Discount</span>
            <span className='font-medium text-success'>
              -{formatPrice(appliedDiscount)}
            </span>
          </div>
        )}

        <div className='flex justify-between text-sm'>
          <span className='text-muted-foreground'>Taxes</span>
          <span className='font-medium text-foreground'>
            {formatPrice(
              TAX_RATE * (Number.parseFloat(totalAmount) - appliedDiscount),
            )}
          </span>
        </div>

        <div className='flex justify-between text-sm'>
          <span className='text-muted-foreground'>Shipping</span>
          <span className='font-medium text-foreground'>
            {formatPrice(SHIPPING_COST)}
          </span>
        </div>
      </div>

      <hr className='my-6' />

      <div className='mb-6'>
        <p className='mb-2 text-xs font-semibold text-muted-foreground'>
          Total Amount
        </p>
        <p className='text-3xl font-bold text-balance text-primary'>
          {formatPrice(finalAmount)}
        </p>
      </div>

      <Button
        size='lg'
        className='w-full'
        onClick={() =>
          toast.promise(
            // oxlint-disable-next-line promise/avoid-new
            new Promise((resolve, reject) =>
              // oxlint-disable-next-line no-promise-executor-return
              setTimeout(Math.random() > 0.5 ? resolve : reject, 2000),
            ),
            {
              loading: 'Processing your order...',
              success: 'Order completed successfully!',
              error: 'Failed to complete the order. Please try again.',
            },
          )
        }
        disabled={!addressId || !paymentMethod}
      >
        <CheckCircle2Icon /> Complete Purchase
      </Button>
    </>
  )
}
