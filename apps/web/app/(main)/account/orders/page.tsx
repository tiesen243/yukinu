import { AccountHeader } from '@/app/(main)/account/_components/header'

export default function AccountOrdersPage() {
  return (
    <>
      <AccountHeader
        title='My Orders'
        description='Review your past orders, track current shipments, and manage returns or exchanges all in one place.'
      />

      <section>
        <h2 className='sr-only'>Orders History List section</h2>
      </section>
    </>
  )
}
