'use client'

import { Button } from '@yukinu/ui/button'
import { Field, FieldError, FieldLabel, FieldSet } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { resetPasswordInput } from '@yukinu/validators/auth'
import { useRouter } from 'next/navigation'

import { useTRPCClient } from '@/lib/trpc/react'

export const ResetPasswordForm: React.FC<{ token: string }> = ({ token }) => {
  const trpc = useTRPCClient()
  const router = useRouter()

  const { FormField, handleSubmit, state } = useForm({
    defaultValues: { token, newPassword: '', confirmNewPassword: '' },
    schema: resetPasswordInput,
    onSubmit: trpc.auth.resetPassword.mutate,
    onSuccess: () => {
      toast.success('Password has been reset successfully!')
      router.push('/login')
    },
    onError: ({ message }) =>
      toast.error('Failed to reset password', { description: message }),
  })

  return (
    <form className='px-6' onSubmit={handleSubmit}>
      <FieldSet>
        <legend className='sr-only'>Reset your password</legend>

        <FormField
          name='newPassword'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={field.id}>New Password</FieldLabel>
              <Input
                {...field}
                type='password'
                placeholder='Enter your new password'
              />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <FormField
          name='confirmNewPassword'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={field.id}>Confirm New Password</FieldLabel>
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
          <Button type='submit' disabled={state.isPending}>
            {state.isPending ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Field>
      </FieldSet>
    </form>
  )
}
