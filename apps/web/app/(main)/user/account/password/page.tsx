import { ChangePasswordForm } from '@/app/(main)/user/account/password/page.client'

export default function PasswordPage() {
  return (
    <section>
      <h3 className='px-4 text-lg font-medium'>Change Password</h3>
      <hr className='my-4' />

      <section className='px-4'>
        <h4 className='sr-only'>Change Password Form</h4>
        <ChangePasswordForm />
      </section>
    </section>
  )
}
