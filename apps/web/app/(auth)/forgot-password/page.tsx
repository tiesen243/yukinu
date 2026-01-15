import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@yukinu/ui/card'
import Link from 'next/link'

import { ForgotPasswordForm } from '@/app/(auth)/forgot-password/page.client'
import { createMetadata } from '@/lib/metadata'

export default function ForgotPasswordPage() {
  return (
    <main className='grid min-h-dvh place-items-center'>
      <Card className='w-full max-w-xl bg-background shadow-none ring-0 sm:bg-card sm:shadow-sm sm:ring-1'>
        <CardHeader>
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription>
            Don&apos;t worry! We&apos;ve got you covered. Just enter your email
            address below, and we&apos;ll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>

        <ForgotPasswordForm />

        <CardFooter>
          <CardDescription className='[&>a]:hover:text-primary [&>a]:hover:underline'>
            Remembered your password? <Link href='/login'>Log in</Link>
          </CardDescription>
        </CardFooter>
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
