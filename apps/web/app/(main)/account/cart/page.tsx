import { AccountHeader } from '@/app/(main)/account/_components/header'
import { createMetadata } from '@/lib/metadata'

export default function AccountCartPage() {
  return (
    <>
      <AccountHeader
        title='My Cart'
        description='View and manage the items in your shopping cart before proceeding to checkout.'
      />

      <section>
        <h2 className='sr-only'>Cart Items List section</h2>
      </section>
    </>
  )
}

const title = 'My Cart'
const description =
  'View and manage the items in your shopping cart before proceeding to checkout.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/account/cart`,
  },
})
