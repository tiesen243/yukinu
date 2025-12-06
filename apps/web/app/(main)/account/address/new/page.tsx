import { AccountHeader } from '@/app/(main)/account/_components/header'
import { NewAddressForm } from '@/app/(main)/account/address/new/page.client'

export default function NewAddressPage() {
  return (
    <>
      <AccountHeader
        title='Add New Address'
        description='Add a new shipping address to your account for faster checkout.'
      />

      <form className='px-6 pt-6'>
        <h2 className='sr-only'>Add New Address form</h2>

        <NewAddressForm />
      </form>
    </>
  )
}
