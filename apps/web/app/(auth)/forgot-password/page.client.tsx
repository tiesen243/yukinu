'use client'

import { Button } from '@yukinu/ui/button'
import { Field, FieldError, FieldLabel, FieldSet } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/toast'
import { forgotPasswordInput } from '@yukinu/validators/auth'

import { useTRPCClient } from '@/lib/trpc/react'

export const ForgotPasswordForm: React.FC = () => {
  const trpc = useTRPCClient()

  const form = useForm({
    defaultValues: { email: '' },
    schema: forgotPasswordInput,
    onSubmit: trpc.auth.forgotPassword.mutate,
    onSuccess: () =>
      toast.add({
        type: 'success',
        title: 'Password reset email sent!',
        description: 'Please check your inbox for the reset link.',
      }),
    onError: ({ message }) =>
      toast.add({
        type: 'error',
        title: 'Failed to send reset email',
        description: message,
      }),
  })

  return (
    <form id={form.formId} className='px-6' onSubmit={form.handleSubmit}>
      <FieldSet>
        <legend className='sr-only'>Forgot your password?</legend>

        <form.Field
          name='email'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={field.id}>Username or Email</FieldLabel>
              <Input {...field} placeholder='Enter your username or email' />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <Field>
          <Button type='submit' disabled={form.state.isPending}>
            {form.state.isPending ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </Field>
      </FieldSet>
    </form>
  )
}
