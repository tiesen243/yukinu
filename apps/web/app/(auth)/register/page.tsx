import Link from 'next/link'

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yukinu/ui/card'

import { RegisterForm } from '@/app/(auth)/_components/register-form'

export default function RegisterPage(_: PageProps<'/register'>) {
  return (
    <>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <RegisterForm />

        <div className='mt-4 grid gap-2 text-center text-sm underline-offset-4'>
          <p>
            Already have an account?{' '}
            <Link
              href='/login'
              className='font-medium text-foreground underline hover:text-foreground/80 focus:ring-2 focus:ring-ring focus:outline-none'
              aria-label='Go to Login page'
            >
              Login
            </Link>
            .
          </p>

          <p className='text-muted-foreground'>
            By creating an account, you agree to our{' '}
            <a
              href='https://tiesen243.github.io/yukinu/term-of-service.html'
              className='font-semibold underline hover:text-foreground/80 focus:ring-2 focus:ring-ring focus:outline-none'
              target='_blank'
              rel='noreferrer'
              aria-label='Read Terms of Service (opens in new tab)'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='https://tiesen243.github.io/yukinu/privacy-policy.html'
              className='font-semibold underline hover:text-foreground/80 focus:ring-2 focus:ring-ring focus:outline-none'
              target='_blank'
              rel='noreferrer'
              aria-label='Read Privacy Policy (opens in new tab)'
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </CardContent>
    </>
  )
}
