'use client'

import { ForgotPasswordDto } from '@yukinu/api/identity'
import { Button } from '@yukinu/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/toast'
import Link from 'next/link'

import { resetTurnstile } from '@/app/(auth)/_lib'
import { useTurnstile } from '@/app/(auth)/layout.client'
import { env } from '@/lib/env'
import { useTRPC } from '@/lib/trpc'
import { verifyTurnstile } from '@/lib/verify-turnstile'

export const ForgotPasswordForm: React.FC = () => {
  const turnstileWidgetId = useTurnstile()
  const { trpcClient } = useTRPC()

  const form = useForm({
    defaultValues: { email: '' },
    schema: ForgotPasswordDto.input,
    onSubmit: async (data, event?: React.SubmitEvent) => {
      await verifyTurnstile(new FormData(event?.target))
      return trpcClient.identity.auth.forgotPassword.mutate(data)
    },
    onSuccess: () => toast.success({ message: 'Password reset email sent!' }),
    onError: ({ message }) => {
      resetTurnstile(turnstileWidgetId)
      toast.error({ message })
    },
  })

  return (
    <form
      id={form.formId}
      onSubmit={form.handleSubmit}
      className='group/field-group @container/field-group flex w-full flex-col gap-5 px-4 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4'
    >
      <form.Field
        name='email'
        render={({ meta, field }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={field.id}>Email</FieldLabel>
            <Input {...field} placeholder='Enter your email' />
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
          {form.state.isPending ? 'Sending...' : 'Send Reset Link'}
        </Button>

        <FieldDescription>
          Remembered your password? <Link href='/login'>Log in here.</Link>
        </FieldDescription>
      </Field>
    </form>
  )
}
