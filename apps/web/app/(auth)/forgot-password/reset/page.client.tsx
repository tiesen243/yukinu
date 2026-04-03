'use client'

import { Button } from '@yukinu/ui/button'
import { Field, FieldError, FieldLabel, FieldSet } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/toast'
import { resetPasswordInput } from '@yukinu/validators/auth'
import { env } from '@yukinu/validators/env.next'
import { useRouter } from 'next/navigation'

import { useTRPCClient } from '@/lib/trpc/react'
import { verifyTurnstile } from '@/lib/verify-turnstile.client'

export const ResetPasswordForm: React.FC<{ token: string }> = ({ token }) => {
  const trpc = useTRPCClient()
  const router = useRouter()

  const form = useForm({
    defaultValues: { token, newPassword: '', confirmNewPassword: '' },
    schema: resetPasswordInput,
    onSubmit: async (data, event) => {
      await verifyTurnstile(event)
      return trpc.auth.resetPassword.mutate(data)
    },
    onSuccess: () => {
      toast.add({
        type: 'success',
        title: 'Password reset successful!',
        description: 'You can now log in with your new password.',
      })
      router.push('/login')
    },
    onError: ({ message }) =>
      toast.add({
        type: 'error',
        title: 'Password reset failed',
        description: message,
      }),
  })

  return (
    <form id={form.formId} className='px-4' onSubmit={form.handleSubmit}>
      <FieldSet>
        <legend className='sr-only'>Reset your password</legend>

        <form.Field
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

        <form.Field
          name='confirmNewPassword'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={field.id}>Confirm New Password</FieldLabel>
              <Input
                {...field}
                type='password'
                placeholder='Confirm your new password'
              />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <Field>
          <div
            className='cf-turnstile'
            data-sitekey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          />

          <Button type='submit' disabled={form.state.isPending}>
            {form.state.isPending ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Field>
      </FieldSet>
    </form>
  )
}
