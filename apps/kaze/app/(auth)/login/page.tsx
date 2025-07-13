import Link from 'next/link'

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yuki/ui/card'

import { LoginForm } from '@/app/(auth)/login/page.client'

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
