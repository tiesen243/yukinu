import { Typography } from '@yuki/ui/typography'

import {
  ChangePasswordForm,
  DeleteAccountForm,
  SessionList,
} from '@/app/(main)/account/security/page.client'

export default function AddressPage() {
  return (
    <section className='grid w-full gap-8'>
      <h2 className='sr-only'>Security Settings</h2>

      <section>
        <Typography variant='h3'>Where You’re Logged In</Typography>
        <SessionList />
      </section>

      <section>
        <Typography variant='h3'>Change Password</Typography>
        <ChangePasswordForm />
      </section>

      <section>
        <Typography variant='h3' className='text-error'>
          Delete Account
        </Typography>
        <DeleteAccountForm />
      </section>
    </section>
  )
}
