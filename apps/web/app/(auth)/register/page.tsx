import Link from 'next/link'

import { Button } from '@yukinu/ui/button'
import { FieldDescription, FieldLegend, FieldSet } from '@yukinu/ui/field'

import { RegisterForm } from '@/app/(auth)/register/page.client'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Register',
  description: 'Create an account to get started',
  openGraph: { url: '/register' },
})

export default function RegisterPage() {
  return (
    <form>
      <FieldSet>
        <FieldLegend>Create an account to get started</FieldLegend>
        <FieldDescription>
          Fill in the details below to create your account.
        </FieldDescription>

        <RegisterForm />

        <FieldDescription>
          By registering, you agree to our
          <Button variant='link' size='sm' asChild>
            <Link href='https://tiesen243.github.io/yukinu/legal/terms-of-service.html'>
              Terms of Service
            </Link>
          </Button>{' '}
          and{' '}
          <Button variant='link' size='sm' asChild>
            <Link href='https://tiesen243.github.io/yukinu/legal/term-of-service.html'>
              Privacy Policy
            </Link>
          </Button>
          .
        </FieldDescription>

        <FieldDescription>
          Already have an account?{' '}
          <Button variant='link' size='sm' asChild>
            <Link href='/login'>Login</Link>
          </Button>
        </FieldDescription>
      </FieldSet>
    </form>
  )
}
