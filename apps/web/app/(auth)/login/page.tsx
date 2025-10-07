import Link from 'next/link'

import { Button } from '@yukinu/ui/button'
import { FieldDescription, FieldLegend, FieldSet } from '@yukinu/ui/field'

import { LoginForm } from '@/app/(auth)/_components/login-form'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Login',
  description: 'Access your account on Yukinu.',
})

export default function LoginPage() {
  return (
    <form>
      <FieldSet>
        <FieldLegend>Login to your account</FieldLegend>
        <FieldDescription>
          Enter your email or username and password to access your account.
        </FieldDescription>

        <LoginForm />

        <FieldDescription className='[&_a]:px-1'>
          Don't have an account?
          <Button type='button' variant='link' size='sm' tabIndex={-1} asChild>
            <Link href='/register'>Register here</Link>
          </Button>
        </FieldDescription>
      </FieldSet>
    </form>
  )
}
