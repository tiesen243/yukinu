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
  void getQueryClient().refetchQueries(
    trpc.order.getUserOrder.queryOptions({ id }),
  )

  return (
    <HydrateClient>
      <section className='grid gap-4'>
        <section className='flex items-center gap-4'>
          <Button variant='ghost' size='icon' asChild>
            <Link href='/account/orders'>
              <ArrowLeftIcon />
            </Link>
          </Button>
          <div>
            <h2 className='text-2xl font-bold'>Order Details</h2>
            <p className='text-muted-foreground'>
              Order #{id.slice(-8).toUpperCase()}
            </p>
          </div>
        </section>

        <Suspense
          fallback={
            <div className='grid h-[50dvh] w-full place-items-center'>
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
