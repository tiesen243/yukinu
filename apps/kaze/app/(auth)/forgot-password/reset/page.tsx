import Link from 'next/link'

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yuki/ui/card'

import { ResetPasswordForm } from '@/app/(auth)/forgot-password/reset/page.client'

export default async function ResetPasswordPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ token: string | undefined }> }>) {
  const { token } = await searchParams

  if (!token) {
    return (
      <CardHeader>
        <CardTitle>Error</CardTitle>
        <CardDescription>
          Invalid or missing reset token. Please try again.
        </CardDescription>
      </CardHeader>
    )
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your new password below. Make sure it meets the security
          requirements.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ResetPasswordForm token={token} />

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
