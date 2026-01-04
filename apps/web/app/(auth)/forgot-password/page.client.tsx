'use client'

import { Button } from '@yukinu/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { forgotPasswordInput } from '@yukinu/validators/auth'

import { useTRPCClient } from '@/lib/trpc/react'

export const ForgotPasswordForm: React.FC = () => {
  const trpc = useTRPCClient()

  const form = useForm({
    defaultValues: { email: '' },
    schema: forgotPasswordInput,
    onSubmit: trpc.auth.forgotPassword.mutate,
    onSuccess: () => toast.success('Password reset email sent!'),
    onError: ({ message }) =>
      toast.error('Failed to send reset email', { description: message }),
  })

  return (
    <FieldGroup>
      <form.Field
        name='email'
        render={({ meta, field }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={meta.fieldId}>Username or Email</FieldLabel>
            <Input {...field} placeholder='Enter your username or email' />
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
          {form.state.isPending ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </Field>
    </FieldGroup>
  )
}
