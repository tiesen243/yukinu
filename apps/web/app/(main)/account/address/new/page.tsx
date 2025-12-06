import { AccountHeader } from '@/app/(main)/account/_components/header'
import { NewAddressForm } from '@/app/(main)/account/address/new/page.client'
import { createMetadata } from '@/lib/metadata'

export default function NewAddressPage() {
  return (
    <>
      <AccountHeader
        title='Add New Address'
        description='Add a new shipping address to your account for faster checkout.'
      />

      <section className='px-6 pt-6'>
        <h2 className='sr-only'>Add New Address form</h2>

        <NewAddressForm />
      </section>
    </>
  )
}

const title = 'Add New Address'
const description =
  'Add a new shipping address to your account for faster checkout.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/account/address/new`,
  },
})
