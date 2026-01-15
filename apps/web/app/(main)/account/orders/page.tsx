import { AccountHeader } from '@/app/(main)/account/_components/header'
import { createMetadata } from '@/lib/metadata'

export default function AccountOrdersPage() {
  return (
    <>
      <AccountHeader
        title='My Orders'
        description='Review your past orders, track current shipments, and manage returns or exchanges all in one place.'
      />

      <section className='px-6'>
        <h2 className='sr-only'>Orders History List section</h2>
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
