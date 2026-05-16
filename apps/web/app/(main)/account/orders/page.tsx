import { ItemGroup } from '@yukinu/ui/item'

import { AccountHeader } from '@/app/(main)/account/_components/header'
import { OrderHistories } from '@/app/(main)/account/orders/page.client'
import { createMetadata } from '@/lib/metadata'

export default function AccountOrdersPage() {
  return (
    <>
      <AccountHeader
        title='My Orders'
        description='Review your past orders, track current shipments, and manage returns or exchanges all in one place.'
      />

      <section className='px-4'>
        <h2 className='sr-only'>Orders History List section</h2>

        <ItemGroup>
          <OrderHistories />
        </ItemGroup>
      </section>
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
