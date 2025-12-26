import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@yukinu/ui/field'
import { FacebookIcon, GoogleIcon } from '@yukinu/ui/icons'
import Link from 'next/link'

import { LoginForm } from '@/app/(auth)/login/page.client'
import { createMetadata } from '@/lib/metadata'

export default function LoginPage() {
  return (
    <main className='grid min-h-dvh place-items-center'>
      <Card
        className='w-full max-w-xl bg-background shadow-none ring-0 sm:bg-card sm:shadow-sm sm:ring-1'
        render={<form method='POST' />}
      >
        <FieldSet className='px-4'>
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

            <Field
              orientation='responsive'
              className='@md/field-group:[&>button]:flex-1'
            >
              <Button
                type='submit'
                variant='outline'
                formAction='/api/auth/facebook'
              >
                <FacebookIcon /> Continue with Facebook
              </Button>
              <Button
                type='submit'
                variant='outline'
                formAction='/api/auth/google'
              >
                <GoogleIcon /> Continue with Google
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </Card>
    </main>
  )
}

const title = 'Login'
const description =
  'Access your account to manage your preferences, view order history, and enjoy personalized features.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: {
    images: [
      `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(
        description,
      )}`,
    ],
    url: `/login`,
  },
})
