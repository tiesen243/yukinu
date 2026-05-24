'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { ReviewItemForm } from '@/app/(main)/account/orders/[id]/_components/review-form'
import { useTRPC } from '@/lib/trpc'

export const ProductReview: React.FC<{ id: number }> = ({ id }) => {
  const { trpc } = useTRPC()
  const { data, status } = useQuery(
    trpc.checkout.order.one.queryOptions({ id }),
  )

  const unreviewedItems = useMemo(
    () =>
      data?.items.filter((item) =>
        data.unreviewedProductIds.includes(item.productId ?? ''),
      ) ?? [],
    [data?.items, data?.unreviewedProductIds],
  )

  if (status !== 'success') return null

  if (unreviewedItems.length === 0)
    return (
      <p className='py-12 text-center text-sm text-muted-foreground'>
        You have reviewed all products in this order.
      </p>
    )

  return unreviewedItems.map((item) => (
    <ReviewItemForm key={item.productId} orderId={id} item={item} />
  ))
}
