import { FieldDescription, FieldLegend, FieldSet } from '@yukinu/ui/field'

import { ResetPasswordForm } from '@/app/(auth)/forgot-password/reset/page.client'

export default async function ResetPasswordPage({
  searchParams,
}: PageProps<'/forgot-password/reset'>) {
  const { token } = await searchParams

  if (!token)
    return (
      <main className='grid min-h-dvh place-items-center'>
        <div className='w-full max-w-xl rounded-xl p-6 text-card-foreground sm:border sm:bg-card sm:shadow-sm'>
          <FieldSet>
            <FieldLegend>Error</FieldLegend>
            <FieldDescription>
              No token provided. Please check the link in your email.
            </FieldDescription>
          </FieldSet>
        </div>
      </main>
    )

  return (
    <main className='grid min-h-dvh place-items-center'>
      <form
        method='POST'
        className='w-full max-w-xl rounded-xl p-6 text-card-foreground sm:border sm:bg-card sm:shadow-sm'
      >
        <FieldSet>
          <FieldLegend>Reset Password</FieldLegend>
          <FieldDescription>
            Enter your new password below. Make sure it's strong and secure.
          </FieldDescription>

          <ResetPasswordForm token={String(token)} />
        </FieldSet>
      </form>
    </main>
  )
}
