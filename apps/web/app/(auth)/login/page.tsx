import Link from 'next/link'

import { Button } from '@yukinu/ui/button'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yukinu/ui/card'

import { LoginForm } from '@/app/(auth)/_components/login-form'

export default function LoginPage() {
  return (
    <>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Login to your account to access exclusive features and stay connected.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm />

        <div className='mt-4 grid gap-2 text-center text-sm underline-offset-4'>
          <p>
            Don't have an account?
            <Button variant='link' size='sm' className='pr-0 pl-1' asChild>
              <Link href='/register' aria-label='Go to Register page'>
                Register
              </Link>
            </Button>
            .
          </p>
        </div>
      </CardContent>
    </>
  )
}
