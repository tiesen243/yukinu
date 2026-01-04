'use client'

import { useSession } from '@yukinu/auth/react'
import { Button } from '@yukinu/ui/button'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { loginInput } from '@yukinu/validators/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const LoginForm: React.FC = () => {
  const { signIn } = useSession()
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      identifier: '',
      password: '',
    },
    schema: loginInput,
    onSubmit: signIn,
    onSuccess: () => {
      toast.success('Logged in successfully!')
      router.push('/')
    },
    onError: ({ message }) =>
      toast.error('Login failed', { description: message }),
  })

  return (
    <FieldGroup>
      <form.Field
        name='identifier'
        render={({ meta, field }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={meta.fieldId}>Username or Email</FieldLabel>
            <Input {...field} placeholder='Enter your username or email' />
            <FieldError errors={meta.errors} />
          </Field>
        )}
      />

      <form.Field
        name='password'
        render={({ meta, field }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldContent className='flex-row justify-between'>
              <FieldLabel htmlFor={meta.fieldId}>Password</FieldLabel>
              <Link
                href='/forgot-password'
                className='text-sm underline-offset-4 hover:underline'
                tabIndex={-1}
              >
                Forgot your password?
              </Link>
            </FieldContent>
            <Input
              {...field}
              type='password'
              placeholder='Enter your password'
            />
            <FieldError errors={meta.errors} />
          </Field>
        )}
      />

      <Field>
        <Button
          type='submit'
          onClick={form.handleSubmit}
          disabled={form.state.isPending}
        >
          {form.state.isPending ? 'Logging in...' : 'Log In'}
        </Button>
      </Field>
    </FieldGroup>
  )
}
