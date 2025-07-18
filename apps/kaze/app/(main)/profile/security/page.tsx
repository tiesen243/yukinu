import { Typography } from '@yuki/ui/typography'

import {
  ChangePasswordFornm,
  DeleteAccountForm,
} from '@/app/(main)/profile/security/page.client'

export default function AddressPage() {
  return (
    <section className='grid w-full gap-8'>
      <h2 className='sr-only'>Security Settings</h2>

      <section>
        <Typography variant='h3'>Change Password</Typography>
        <ChangePasswordFornm />
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
