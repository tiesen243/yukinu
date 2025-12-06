import { FieldDescription, FieldLegend, FieldSet } from '@yukinu/ui/field'

import { ResetPasswordForm } from '@/app/(auth)/forgot-password/reset/page.client'
import { createMetadata } from '@/lib/metadata'

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

const title = 'Reset Your Password'
const description =
  'Set a new password to regain access to your account and keep it secure.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/forgot-password/reset`,
  },
})
