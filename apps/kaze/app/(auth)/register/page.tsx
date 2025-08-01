import Link from 'next/link'

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yuki/ui/card'

import { RegisterForm } from '@/app/(auth)/register/page.client'
import { createMetadata } from '@/lib/metadata'

export default function RegisterPage() {
  return (
    <>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Enter your credentials below to register for an account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <RegisterForm />

        <p className='mt-4 text-sm'>
          Already have an account?{' '}
          <Link href={`/login`} className='hover:underline'>
            Login
          </Link>
        </p>
      </CardContent>
    </>
  )
}

export const metadata = createMetadata({
  title: 'Register',
  description: 'Register for an account',
  openGraph: {
    images: [
      `/api/og?title=Register&description=Register%20for%20an%20account`,
    ],
    url: '/register',
  },
})
