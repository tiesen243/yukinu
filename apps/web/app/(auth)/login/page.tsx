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

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { redirect_to } = await searchParams

  return (
    <>
      <form>
        <FieldSet>
          <FieldLegend>Login to your account</FieldLegend>
          <FieldDescription>
            Fill in your credentials to access your account.
          </FieldDescription>
          <LoginForm redirectTo={String(redirect_to ?? '/')} />

          <FieldDescription>
            Don't have an account?{' '}
            <Button variant='link' size='sm' asChild>
              <Link href='/register'>Register</Link>
            </Button>
          </FieldDescription>
        </FieldSet>
      </form>

      <div className='mt-6'>
        <FieldSeparator className='[&_[data-slot=field-separator-content]]:bg-card'>
          or
        </FieldSeparator>
        <Field className='mt-6 grid gap-4 sm:grid-cols-2'>
          <Button variant='outline' asChild>
            <Link
              prefetch={false}
              href={{
                pathname: '/api/auth/facebook',
                query: { redirect_to: redirect_to ?? '/' },
              }}
            >
              <FacebookIcon /> Continue with Facebook
            </Link>
          </Button>
          <Button variant='outline' asChild>
            <Link
              prefetch={false}
              href={{
                pathname: '/api/auth/google',
                query: { redirect_to: redirect_to ?? '/' },
              }}
            >
              <GoogleIcon /> Continue with Google
            </Link>
          </Button>
        </Field>
      </div>
    </>
  )
}
