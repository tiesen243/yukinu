import { FieldDescription, FieldLegend, FieldSet } from '@yukinu/ui/field'

import { VerifyEmailForm } from '@/app/(auth)/verify-email/page.client'

export default async function VerifyEmailPage({
  searchParams,
}: PageProps<'/verify-email'>) {
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
          <FieldLegend>Verify Email</FieldLegend>
          <FieldDescription>
            Click the button below to verify your email address.
          </FieldDescription>

          <VerifyEmailForm token={String(token)} />
        </FieldSet>
      </form>
    </main>
  )
}
