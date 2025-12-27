'use client'

import { Button } from '@yukinu/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { AuthValidators } from '@yukinu/validators/auth'
import { useRouter } from 'next/navigation'

import { useTRPCClient } from '@/lib/trpc/react'

export const ResetPasswordForm: React.FC<{ token: string }> = ({ token }) => {
  const trpc = useTRPCClient()
  const router = useRouter()

  const form = useForm({
    defaultValues: { token, newPassword: '', confirmNewPassword: '' },
    schema: AuthValidators.resetPasswordInput,
    onSubmit: trpc.auth.resetPassword.mutate,
    onSuccess: () => {
      toast.success('Password has been reset successfully!')
      router.push('/login')
    },
    onError: ({ message }) =>
      toast.error('Failed to reset password', { description: message }),
  })

  return (
    <FieldGroup>
      <form.Field
        name='newPassword'
        render={({ meta, field }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={meta.fieldId}>New Password</FieldLabel>
            <Input
              {...field}
              type='password'
              placeholder='Enter your new password'
            />
            <FieldError errors={meta.errors} />
          </Field>
        )}
      />

      <form.Field
        name='confirmNewPassword'
        render={({ meta, field }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={meta.fieldId}>Confirm New Password</FieldLabel>
            <Input
              {...field}
              type='password'
              placeholder='Confirm your new password'
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
          {form.state.isPending ? 'Resetting...' : 'Reset Password'}
        </Button>
      </Field>
    </FieldGroup>
  )
}
