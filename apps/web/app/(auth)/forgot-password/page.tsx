import Link from 'next/link'

import { Card } from '@yukinu/ui/card'
import { FieldDescription, FieldLegend, FieldSet } from '@yukinu/ui/field'

import { ForgotPasswordForm } from '@/app/(auth)/forgot-password/page.client'
import { createMetadata } from '@/lib/metadata'

export default function ForgotPasswordPage() {
  return (
    <main className='grid min-h-dvh place-items-center'>
      <Card
        className='w-full max-w-xl bg-background shadow-none ring-0 sm:bg-card sm:shadow-sm sm:ring-1'
        render={<form method='POST' />}
      >
        <FieldSet className='px-4'>
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
      </Card>
    </main>
  )
}

const title = 'Forgot Password'
const description =
  "Can't remember your password? No worries! Enter your email address to receive a password reset link and regain access to your account."
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/forgot-password`,
  },
})
