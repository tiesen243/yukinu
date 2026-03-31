import { Typography } from '@yukinu/ui/typography'

import { useTRPC } from '@/lib/trpc/react'

import type { Route } from './+types/[id]'

export default function VendorOrderDetailPage({
  params,
}: Route.ComponentProps) {
  const _trpc = useTRPC()

  return (
    <>
      <Typography variant='h2'>Order #{params.id}</Typography>
      <Typography className='text-muted-foreground'>
        Detailed information about order #{params.id} will be displayed here.
      </Typography>
    </>
  )
}
