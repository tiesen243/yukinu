import { Loader2Icon } from '@yukinu/ui/icons'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import { EditAddressForm } from '@/app/(main)/account/address/[id]/page.client'
import { createMetadata } from '@/lib/metadata'
import { getQueryClient, HydrateClient, trpc } from '@/lib/trpc/rsc'

export default async function EditAddressPage({
  params,
}: PageProps<'/account/address/[id]'>) {
  const { id } = await params
  void getQueryClient().prefetchQuery(trpc.address.one.queryOptions({ id }))

  return (
    <HydrateClient>
      <AccountHeader
        title='Edit Address'
        description='Update your address information.'
      />

      <section className='px-4'>
        <h2 className='sr-only'>Edit Address {id} form</h2>

        <Suspense
          fallback={
            <div className='flex h-96 w-full animate-pulse flex-col items-center justify-center gap-4'>
              <Loader2Icon className='size-8 animate-spin' />
              <span className='text-sm text-muted-foreground'>
                Loading address <strong>{id}</strong>...
              </span>
            </div>
          }
        >
          <EditAddressForm id={id} />
        </Suspense>
      </section>
    </HydrateClient>
  )
}

export const generateMetadata = async ({
  params,
}: PageProps<'/account/address/[id]'>) => {
  const { id } = await params

  try {
    const address = await getQueryClient().ensureQueryData(
      trpc.address.one.queryOptions({ id }),
    )

    const title = `Edit Address: ${address.recipientName}`
    const description = `Update the address information for ${address.recipientName}. If needed, you can modify the recipient's name, street address, city, postal code, and other relevant details.`

    return createMetadata({
      title,
      description,
      openGraph: {
        images: [
          `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
            description,
          )}`,
        ],
        url: `/account/address/${id}/edit`,
      },
    })
  } catch {
    notFound()
  }
}
