import Link from 'next/link'

import { Button } from '@yukinu/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@yukinu/ui/field'

import { LoginForm } from '@/app/(auth)/login/page.client'

export default function LoginPage() {
  return (
    <main className='grid min-h-dvh place-items-center'>
      <form
        method='POST'
        className='w-full max-w-xl rounded-xl p-6 text-card-foreground sm:border sm:bg-card sm:shadow-sm'
      >
        <FieldSet>
          <FieldLegend>Login</FieldLegend>
          <FieldDescription>
            Welcome back! Please enter your credentials to log in.
          </FieldDescription>

          <LoginForm />

          <FieldDescription>
            Don&apos;t have an account?{' '}
            <Link href='/register'>Register here</Link>.
          </FieldDescription>

          <FieldGroup>
            <FieldSeparator className='sm:[&>span]:bg-card'>or</FieldSeparator>

            <Field orientation='responsive' className='[&>button]:flex-1'>
              <Button variant='outline' formAction='/api/auth/facebook'>
                Continue with Facebook
              </Button>
              <Button variant='outline' formAction='/api/auth/google'>
                Continue with Google
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </main>
  )
}
