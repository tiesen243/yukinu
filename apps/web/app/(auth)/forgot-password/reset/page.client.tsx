'use client'

import { ResetPasswordDto } from '@yukinu/api/identity'
import { Button } from '@yukinu/ui/button'
import { Field, FieldError, FieldLabel } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/toast'
import { useRouter } from 'next/navigation'

import { env } from '@/lib/env'
import { useTRPC } from '@/lib/trpc'
import { verifyTurnstile } from '@/lib/verify-turnstile'

export const ResetPasswordForm: React.FC<{ token: string }> = ({ token }) => {
  const { trpcClient } = useTRPC()
  const router = useRouter()

  const form = useForm({
    defaultValues: { token, newPassword: '', confirmNewPassword: '' },
    schema: ResetPasswordDto.input,
    onSubmit: async (data, event?: React.SubmitEvent) => {
      await verifyTurnstile(new FormData(event?.target))
      return trpcClient.identity.auth.resetPassword.mutate(data)
    },
    onSuccess: () => [
      toast.success({
        message: 'Password reset successful!',
        description: 'You can now log in with your new password.',
      }),
      router.push('/login'),
    ],
    onError: ({ message }) => toast.error({ message }),
  })

  return (
    <form
      id={form.formId}
      onSubmit={form.handleSubmit}
      className='group/field-group @container/field-group flex w-full flex-col gap-5 px-4 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4'
    >
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
    </form>
  )
}
