import {
  FieldDescription,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@yukinu/ui/field'

import { ChangePasswordForm } from '@/app/(main)/user/account/password/page.client'

export default function PasswordPage() {
  return (
    <form>
      <FieldSet>
        <div className='px-4'>
          <FieldLegend className='data-[variant=legend]:text-lg'>
            Change Password
          </FieldLegend>

          <FieldDescription>
            Please enter your current password and choose a new one. Make sure
            your new password is strong and unique.
          </FieldDescription>
        </div>

        <FieldSeparator className='-my-2' />

        <ChangePasswordForm />
      </FieldSet>
    </form>
  )
}
