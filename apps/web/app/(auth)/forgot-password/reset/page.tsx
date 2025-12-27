import { Card } from '@yukinu/ui/card'
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
        <Card className='w-full max-w-xl bg-background shadow-none ring-0 sm:bg-card sm:shadow-sm sm:ring-1'>
          <FieldSet className='px-4'>
            <FieldLegend>Error</FieldLegend>
            <FieldDescription>
              No token provided. Please check the link in your email.
            </FieldDescription>
          </FieldSet>
        </Card>
      </main>
    )

  return (
    <main className='grid min-h-dvh place-items-center'>
      <Card
        className='w-full max-w-xl bg-background shadow-none ring-0 sm:bg-card sm:shadow-sm sm:ring-1'
        render={<form method='POST' />}
      >
        <FieldSet className='px-4'>
          <FieldLegend>Reset Password</FieldLegend>
          <FieldDescription>
            Enter your new password below. Make sure it&apos;s strong and
            secure.
          </FieldDescription>
          <ResetPasswordForm token={String(token)} />
        </FieldSet>
      </Card>
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
