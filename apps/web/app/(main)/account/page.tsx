import { AccountHeader } from '@/app/(main)/account/_components/header'

export default function AccountPage() {
  return (
    <>
      <AccountHeader
        title='My Profile'
        description='View and update your personal details, email, and password to keep your account secure.'
      />

      <section>
        <h2 className='sr-only'>Profile Information section</h2>
      </section>
    </>
  )
}
