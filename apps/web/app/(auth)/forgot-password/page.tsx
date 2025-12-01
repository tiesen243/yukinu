import Link from 'next/link'

import { FieldDescription, FieldLegend, FieldSet } from '@yukinu/ui/field'

import { ForgotPasswordForm } from '@/app/(auth)/forgot-password/page.client'

export default function ForgotPasswordPage() {
  return (
    <main className='grid min-h-dvh place-items-center'>
      <form
        method='POST'
        className='w-full max-w-xl rounded-xl p-6 text-card-foreground sm:border sm:bg-card sm:shadow-sm'
      >
        <FieldSet>
          <FieldLegend>Forgot Password</FieldLegend>
          <FieldDescription>
            Enter your email address below and we'll send you a link to reset
            your password.
          </FieldDescription>

          <ForgotPasswordForm />

          <FieldDescription>
            Remembered your password? <Link href='/login'>Log in</Link>
          </FieldDescription>
        </FieldSet>
      </form>
    </main>
  )
}
