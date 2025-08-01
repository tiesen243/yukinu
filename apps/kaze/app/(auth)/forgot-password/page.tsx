import Link from 'next/link'

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yuki/ui/card'

import { ForgotPasswordForm } from '@/app/(auth)/forgot-password/page.client'
import { createMetadata } from '@/lib/metadata'

export default function ForgotPasswordPage() {
  return (
    <>
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address below and we will send you a link to reset
          your password.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ForgotPasswordForm />

        <p className='mt-4 text-sm'>
          Remembered your password?{' '}
          <Link href='/login' className='hover:underline'>
            Back to Sign In
          </Link>
        </p>
      </CardContent>
    </>
  )
}

export const metadata = createMetadata({
  title: 'Forgot Password',
  description: 'Reset your password',
  openGraph: {
    images: [
      `/api/og?title=Forgot%20Password&description=Reset%20your%20password`,
    ],
    url: '/forgot-password',
  },
})
