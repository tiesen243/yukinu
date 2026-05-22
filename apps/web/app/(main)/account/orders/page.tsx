import { Button } from '@yukinu/ui/button'
import { ItemGroup } from '@yukinu/ui/item'
import Link from 'next/link'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import { OrderHistories } from '@/app/(main)/account/orders/page.client'
import { createMetadata } from '@/lib/metadata'

export default async function AccountOrdersPage({
  searchParams,
}: PageProps<'/account/orders'>) {
  const { paymentId } = await searchParams
  const normalizedPaymentId =
    typeof paymentId === 'string' ? paymentId : undefined

  return (
    <>
      <AccountHeader
        title='My Orders'
        description='Review your past orders, track current shipments, and manage returns or exchanges all in one place.'
      />

      <section className='flex-1 px-4'>
        <h2 className='sr-only'>Orders History List section</h2>

        <ItemGroup>
          <OrderHistories paymentId={normalizedPaymentId} />
        </ItemGroup>
      </section>

      {normalizedPaymentId && (
        <section className='flex justify-end px-4'>
          <Button
            nativeButton={false}
            render={
              <Link href={`/account/orders/checkout/${normalizedPaymentId}`} />
            }
          >
            Process to Checkout
          </Button>
        </section>
      )}
    </>
  )
}

const title = 'My Orders'
const description =
  'Review your past orders, track current shipments, and manage returns or exchanges all in one place.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/account/orders`,
  },
})
