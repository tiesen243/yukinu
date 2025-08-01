import { Suspense } from 'react'
import Link from 'next/link'

import { Button } from '@yuki/ui/button'
import { ArrowLeftIcon, Loader2Icon } from '@yuki/ui/icons'

import { OrderDetail } from '@/app/(main)/account/orders/[id]/page.client'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/rsc'

export default async function OrderDetailPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params
  void getQueryClient().prefetchQuery(trpc.order.byId.queryOptions({ id }))

  return (
    <HydrateClient>
      <section className='w-full'>
        <div className='mb-4 flex items-center gap-4'>
          <Button variant='ghost' size='icon' asChild>
            <Link href='/account/orders'>
              <ArrowLeftIcon />
            </Link>
          </Button>
          <h2 className='text-2xl font-bold'>Order Details</h2>
        </div>

        <Suspense
          fallback={
            <div className='grid w-full place-items-center py-20'>
              <Loader2Icon className='animate-spin' />
            </div>
          }
        >
          <OrderDetail id={id} />
        </Suspense>
      </section>
    </HydrateClient>
  )
}
