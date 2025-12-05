import { AccountHeader } from '@/app/(main)/account/_components/header'

export default function AccountSecurityPage() {
  return (
    <>
      <AccountHeader
        title='Security Settings'
        description='Manage your password, two-factor authentication, and other security settings to keep your account safe.'
      />

      <section>
        <h2 className='sr-only'>Where you are logged in section</h2>
      </section>

      <section>
        <h2 className='sr-only'>Change Password or Username section</h2>
      </section>

      <section>
        <h2 className='sr-only'>Delete Account section</h2>
      </section>
    </>
  )
}
