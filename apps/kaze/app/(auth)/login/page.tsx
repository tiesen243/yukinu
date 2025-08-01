import Link from 'next/link'

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yuki/ui/card'

import { LoginForm } from '@/app/(auth)/login/page.client'
import { createMetadata } from '@/lib/metadata'

export default function LoginPage() {
  return (
    <>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials below to login to your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm />

        <p className='mt-4 text-sm'>
          Don&apos;t have an account?{' '}
          <Link href={`/register`} className='hover:underline'>
            Register
          </Link>
        </p>
      </CardContent>
    </>
  )
}

export const metadata = createMetadata({
  title: 'Login',
  description: 'Login to your account',
  openGraph: {
    images: [`/api/og?title=Login&description=Login%20to%20your%20account`],
    url: '/login',
  },
})
