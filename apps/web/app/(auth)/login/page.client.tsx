'use client'

import { SignInDto } from '@yukinu/api/identity'
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
import { useRouter } from 'next/navigation'

import { env } from '@/lib/env'
import { useTRPC } from '@/lib/trpc'
import { verifyTurnstile } from '@/lib/verify-turnstile'

export const LoginForm: React.FC = () => {
  const { trpcClient } = useTRPC()
  const router = useRouter()

  const form = useForm({
    defaultValues: { identifier: '', password: '' },
    schema: SignInDto.input,
    onSubmit: async (data, event?: React.SubmitEvent) => {
      await verifyTurnstile(new FormData(event?.target))
      return trpcClient.identity.auth.signIn.mutate(data)
    },
    onSuccess: () => [
      toast.success({ message: 'Logged in successfully! Redirecting...' }),
      router.push('/'),
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
        name='identifier'
        render={({ field, meta }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={field.id}>Email or Username</FieldLabel>
            <Input {...field} placeholder='Enter your email or username' />
            <FieldError id={meta.errorId} errors={meta.errors} />
          </Field>
        )}
      />

      <form.Field
        name='password'
        render={({ field, meta }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <Field orientation='horizontal'>
              <FieldLabel htmlFor={field.id}>Password</FieldLabel>

              <Link
                href='/forgot-password'
                className='hover:underline'
                tabIndex={-1}
              >
                Forgot password?
              </Link>
            </Field>
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
        <div
          className='cf-turnstile'
          data-sitekey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        />

        <Button type='submit' disabled={form.state.isPending}>
          {form.state.isPending ? 'Logging in...' : 'Login'}
        </Button>

        <FieldDescription>
          Don't have an account? <Link href='/register'>Register here</Link>
        </FieldDescription>
      </Field>
    </form>
  )
}
