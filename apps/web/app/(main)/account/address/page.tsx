import { AccountHeader } from '@/app/(main)/account/_components/header'

export default function AddressPage() {
  return (
    <>
      <AccountHeader
        title='My Addresses'
        description='View, add, and manage your saved shipping addresses for faster checkout.'
      />

      <section>
        <h2 className='sr-only'>Address List section</h2>
      </section>
    </>
  )
}
