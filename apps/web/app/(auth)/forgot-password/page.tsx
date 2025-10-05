import Link from 'next/link'

import { Button } from '@yukinu/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@yukinu/ui/field'
import { Input } from '@yukinu/ui/input'

import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Forgot Password',
  description: "Reset your password on Yukinu if you've forgotten it.",
})

export default function ForgotPasswordPage(_: PageProps<'/forgot-password'>) {
  return (
    <FieldSet className='relative' disabled>
      <FieldLegend>Forgot Password</FieldLegend>
      <FieldDescription>
        We'll send you an email to reset your password if you have an account.
      </FieldDescription>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='email'>Email</FieldLabel>
          <Input id='email' type='email' placeholder='example@yukinu.com' />
        </Field>

        <Field>
          <Button type='submit'>Send Reset Link</Button>
        </Field>
      </FieldGroup>

      <FieldDescription>
        Remembered your password?{' '}
        <Button variant='link' size='sm' className='p-0' tabIndex={-1} asChild>
          <Link href='/login'>Login</Link>
        </Button>
      </FieldDescription>
    </FieldSet>
  )
}
