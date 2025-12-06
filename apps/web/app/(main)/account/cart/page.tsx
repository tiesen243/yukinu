import { AccountHeader } from '@/app/(main)/account/_components/header'

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
