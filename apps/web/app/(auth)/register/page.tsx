import Link from 'next/link'

import { Button } from '@yukinu/ui/button'
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
            Already have an account?
            <Button variant='link' size='sm' className='pr-0 pl-1' asChild>
              <Link href='/login' aria-label='Go to Login page'>
                Login
              </Link>
            </Button>
            .
          </p>

          <p className='text-muted-foreground'>
            By creating an account, you agree to our
            <Button variant='link' size='sm' className='px-1' asChild>
              <a
                href='https://tiesen243.github.io/yukinu/term-of-service.html'
                target='_blank'
                rel='noreferrer'
                aria-label='Read Terms of Service (opens in new tab)'
              >
                Terms of Service
              </a>
            </Button>
            and
            <Button variant='link' size='sm' className='pr-0 pl-1' asChild>
              <a
                href='https://tiesen243.github.io/yukinu/privacy-policy.html'
                target='_blank'
                rel='noreferrer'
                aria-label='Read Privacy Policy (opens in new tab)'
              >
                Privacy Policy
              </a>
            </Button>
            .
          </p>
        </div>
      </CardContent>
    </>
  )
}
