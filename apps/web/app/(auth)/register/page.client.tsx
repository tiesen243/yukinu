'use client'

import { SignUpDto } from '@yukinu/api/identity'
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

export const RegisterForm: React.FC = () => {
  const turnstileWidgetId = useTurnstile()
  const { trpcClient } = useTRPC()

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    schema: SignUpDto.input,
    onSubmit: async (data, event?: React.SubmitEvent) => {
      await verifyTurnstile(new FormData(event?.target))
      return trpcClient.identity.auth.signUp.mutate(data)
    },
    onSuccess: () => {
      toast.success({
        message: 'Registration successful!',
        description: 'Please check your email to verify your account.',
      })
    },
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
      <Field orientation='horizontal'>
        <form.Field
          name='username'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={field.id}>Username</FieldLabel>
              <Input {...field} placeholder='Enter your username' />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <form.Field
          name='email'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={field.id}>Email</FieldLabel>
              <Input {...field} type='email' placeholder='Enter your email' />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />
      </Field>

      <form.Field
        name='password'
        render={({ meta, field }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={field.id}>Password</FieldLabel>
            <Input
              {...field}
              type='password'
              placeholder='Enter your password'
            />
            <FieldError id={meta.errorId} errors={meta.errors} />
          </Field>
        )}
      />

      <form.Field
        name='confirmPassword'
        render={({ meta, field }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={field.id}>Confirm Password</FieldLabel>
            <Input
              {...field}
              type='password'
              placeholder='Confirm your password'
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
          {form.state.isPending ? 'Registering...' : 'Register'}
        </Button>

        <FieldDescription>
          By registering, you agree to our{' '}
          <Link href='/terms' target='_blank' className='underline'>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href='/privacy' target='_blank' className='underline'>
            Privacy Policy
          </Link>
          .
        </FieldDescription>

        <FieldDescription>
          Already have an account? <Link href='/login'>Login here</Link>
        </FieldDescription>
      </Field>
    </form>
  )
}
