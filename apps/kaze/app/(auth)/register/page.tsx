import Link from 'next/link'

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yuki/ui/card'

import { RegisterForm } from './page.client'

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
