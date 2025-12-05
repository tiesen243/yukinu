'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/lib/trpc/react'

export const ProductDetails: React.FC<{ id: string }> = ({ id }) => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.product.one.queryOptions({ id }))

  return (
    <section>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </section>
  )
}
