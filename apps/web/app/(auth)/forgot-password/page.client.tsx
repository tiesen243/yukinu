'use client'

import { Button } from '@yukinu/ui/button'
import { Field, FieldError, FieldLabel, FieldSet } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { forgotPasswordInput } from '@yukinu/validators/auth'

import { useTRPCClient } from '@/lib/trpc/react'

export const ForgotPasswordForm: React.FC = () => {
  const trpc = useTRPCClient()

  const { formId, FormField, handleSubmit, state } = useForm({
    defaultValues: { email: '' },
    schema: forgotPasswordInput,
    onSubmit: trpc.auth.forgotPassword.mutate,
    onSuccess: () => toast.success('Password reset email sent!'),
    onError: ({ message }) =>
      toast.error('Failed to send reset email', { description: message }),
  })

  return (
    <form id={formId} className='px-6' onSubmit={handleSubmit}>
      <FieldSet>
        <legend className='sr-only'>Forgot your password?</legend>

        <FormField
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
          <Button type='submit' disabled={state.isPending}>
            {state.isPending ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </Field>
      </FieldSet>
    </form>
  )
}
