import { Suspense } from 'react'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import { EditAddressForm } from '@/app/(main)/account/address/[id]/page.client'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

export default async function EditAddressPage({
  params,
}: PageProps<'/account/address/[id]'>) {
  const { id } = await params
  void getQueryClient().prefetchQuery(trpc.user.oneAddress.queryOptions({ id }))

  return (
    <HydrateClient>
      <AccountHeader
        title='Edit Address'
        description='Update your address information.'
      />

      <form className='px-6 pt-6'>
        <h2 className='sr-only'>Edit Address {id} form</h2>

        <Suspense>
          <EditAddressForm id={id} />
        </Suspense>
      </form>
    </HydrateClient>
  )
}
