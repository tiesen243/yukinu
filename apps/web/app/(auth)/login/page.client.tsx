'use client'

import { useSession } from '@yukinu/auth/react'
import { Button } from '@yukinu/ui/button'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSet,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { loginInput } from '@yukinu/validators/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const LoginForm: React.FC<{ redirectTo: string }> = ({ redirectTo }) => {
  const { signIn } = useSession()
  const router = useRouter()

  const { formId, FormField, handleSubmit, state } = useForm({
    defaultValues: {
      identifier: '',
      password: '',
    },
    schema: loginInput,
    onSubmit: signIn,
    onSuccess: () => {
      toast.success('Logged in successfully!')
      router.push(redirectTo as never)
    },
    onError: ({ message }) =>
      toast.error('Login failed', { description: message }),
  })

  return (
    <form id={formId} className='px-6' onSubmit={handleSubmit}>
      <FieldSet>
        <legend className='sr-only'>Login to your account</legend>

        <FormField
          name='identifier'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={field.id}>Username or Email</FieldLabel>
              <Input {...field} placeholder='Enter your username or email' />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <FormField
          name='password'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldContent className='flex-row justify-between'>
                <FieldLabel htmlFor={field.id}>Password</FieldLabel>
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
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <Field>
          <Button type='submit' disabled={state.isPending}>
            {state.isPending ? 'Logging in...' : 'Log In'}
          </Button>
        </Field>
      </FieldSet>
    </form>
  )
}
