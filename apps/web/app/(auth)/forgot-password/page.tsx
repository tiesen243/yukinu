import { CardDescription, CardHeader, CardTitle } from '@yukinu/ui/card'

import { ForgotPasswordForm } from '@/app/(auth)/forgot-password/page.client'
import { createMetadata } from '@/lib/metadata'

const title = 'Forgot Password'
const description =
  "Can't remember your password? No worries! Enter your email address to receive a password reset link and regain access to your account."

export default function ForgotPasswordPage() {
  return (
    <>
      <CardHeader>
        <CardTitle>Forgot your password?</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <ForgotPasswordForm />
    </>
  )
}

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
