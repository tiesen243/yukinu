import Link from 'next/link'

import { Button } from '@yukinu/ui/button'
import { FieldDescription, FieldLegend, FieldSet } from '@yukinu/ui/field'

import { RegisterForm } from '@/app/(auth)/_components/register-form'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Register',
  description: 'Create a new account on Yukinu.',
})

export default function RegisterPage(_: PageProps<'/register'>) {
  return (
    <form>
      <FieldSet>
        <FieldLegend>Create an account</FieldLegend>
        <FieldDescription>
          Fill in the details below to create your account.
        </FieldDescription>
        <RegisterForm />

        <FieldDescription className='[&_a]:px-1'>
          Already have an account?
          <Button type='button' variant='link' size='sm' tabIndex={-1} asChild>
            <Link href='/login'>Login</Link>
          </Button>
        </FieldDescription>

        <FieldDescription>
          By creating an account, you agree to our{' '}
          <a
            href='https://tiesen243.github.io/yukinu/legal/term-of-service.html'
            target='_blank'
            rel='noreferrer'
          >
            Terms of Service
          </a>
          {' and '}
          <a
            href='https://tiesen243.github.io/yukinu/legal/privacy-policy.html'
            target='_blank'
            rel='noreferrer'
          >
            Privacy Policy
          </a>
          .
        </FieldDescription>
      </FieldSet>
    </form>
  )
}
