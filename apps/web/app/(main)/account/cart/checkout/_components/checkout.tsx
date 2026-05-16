'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { TAX_RATE, SHIPPING_COST } from '@yukinu/lib/constants'
import { formatPrice } from '@yukinu/lib/utils'
import { Button } from '@yukinu/ui/button'
import { CheckCircle2Icon } from '@yukinu/ui/icons'
import { toast } from '@yukinu/ui/toast'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { usePage } from '@/app/(main)/account/cart/checkout/page.provider'
import { useTRPC } from '@/lib/trpc'

export function Checkout() {
  const { trpc } = useTRPC()
  const { data: { totalAmount } = { totalAmount: '0' }, status } = useQuery(
    trpc.sales.cart.get.queryOptions({}),
  )
  const { voucher, addressId, paymentMethod } = usePage()

  const router = useRouter()
  const { mutateAsync } = useMutation({
    ...trpc.checkout.order.checkout.mutationOptions(),
    onSuccess: () => router.push('/account/orders'),
    meta: { filter: trpc.sales.cart.get.queryFilter() },
  })

  const appliedDiscount = useMemo(() => {
    if (voucher.discountAmount) return Number.parseFloat(voucher.discountAmount)
    if (voucher.discountPercentage)
      return (voucher.discountPercentage / 100) * Number.parseFloat(totalAmount)
    return 0
  }, [voucher, totalAmount])

  const finalAmount = useMemo(() => {
    let amount = Math.max(Number.parseFloat(totalAmount) - appliedDiscount, 0)
    amount += TAX_RATE * amount + SHIPPING_COST
    return Math.max(amount, 0)
  }, [totalAmount, appliedDiscount])

  if (status !== 'success') return <CheckoutSkeleton />

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
              TAX_RATE *
                Math.max(Number.parseFloat(totalAmount) - appliedDiscount, 0),
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
          addressId &&
          paymentMethod &&
          toast.promise(
            mutateAsync({ voucherId: voucher.id, addressId, paymentMethod }),
            {
              loading: 'Processing your order...',
              success: 'Order completed successfully!',
              error: ({ message }) => ({
                title: 'Checkout failed',
                description: message,
              }),
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

const CheckoutSkeleton = () => (
  <>
    <div className='mb-6 animate-pulse space-y-4'>
      <div className='flex justify-between text-sm'>
        <span className='text-muted-foreground'>Subtotal</span>
        <span className='w-20 rounded-sm bg-muted font-medium'>&nbsp;</span>
      </div>

      <div className='flex animate-pulse justify-between text-sm'>
        <span className='text-muted-foreground'>Taxes</span>
        <span className='w-20 rounded-sm bg-muted font-medium'>&nbsp;</span>
      </div>

      <div className='flex animate-pulse justify-between text-sm'>
        <span className='text-muted-foreground'>Shipping</span>
        <span className='w-20 rounded-sm bg-muted font-medium'>&nbsp;</span>
      </div>
    </div>

    <hr className='my-6' />

    <div className='mb-6 animate-pulse'>
      <p className='mb-2 text-xs font-semibold text-muted-foreground'>
        Total Amount
      </p>
      <p className='w-32 rounded-sm bg-muted text-3xl font-bold'>&nbsp;</p>
    </div>

    <Button size='lg' className='w-full' disabled>
      <CheckCircle2Icon />
      Complete Purchase
    </Button>
  </>
)
