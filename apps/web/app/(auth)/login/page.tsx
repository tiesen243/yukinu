import Link from 'next/link'

import { Button } from '@yukinu/ui/button'
import {
  Field,
  FieldDescription,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@yukinu/ui/field'
import { FacebookIcon, GoogleIcon } from '@yukinu/ui/icons'

import { LoginForm } from '@/app/(auth)/login/page.client'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Login',
  description: 'Login to your account',
  openGraph: { url: '/login' },
})

export default function LoginPage() {
  return (
    <>
      <form>
        <FieldSet>
          <FieldLegend>Login to your account</FieldLegend>
          <FieldDescription>
            Fill in your credentials to access your account.
          </FieldDescription>
          <LoginForm />

          <FieldDescription>
            Don't have an account?
            <Button variant='link' size='sm' asChild>
              <Link href='/register'>Register</Link>
            </Button>
          </FieldDescription>
        </FieldSet>
      </form>

      <form method='POST' className='mt-6'>
        <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
          or
        </FieldSeparator>
        <Field className='mt-6 grid gap-4 sm:grid-cols-2'>
          <Button
            type='submit'
            variant='outline'
            formAction='/api/auth/facebook'
          >
            <FacebookIcon /> Continue with Facebook
          </Button>
          <Button type='submit' variant='outline' formAction='/api/auth/google'>
            <GoogleIcon /> Continue with Google
          </Button>
        </Field>
      </form>
    </>
  )
}
