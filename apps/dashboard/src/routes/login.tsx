// oxlint-disable no-shadow

import { SignInDto } from '@yukinu/api/identity'
import { Button } from '@yukinu/ui/button'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yukinu/ui/card'
import { Field, FieldError, FieldLabel } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/toast'
import { useNavigate } from 'react-router'

import { useTurnstile } from '@/components/turnstile.provider'
import { env } from '@/lib/env'
import { createMetadata } from '@/lib/metadata'
import { useTRPC } from '@/lib/trpc'
import { resetTurnstile, verifyTurnstile } from '@/lib/turnstile'

import type { Route } from './+types/login'

export const meta: Route.MetaFunction = () =>
  createMetadata({
    title: 'Login',
    openGraph: { url: '/login' },
  })

export default function LoginPage(_: Route.ComponentProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Fill in your credentials to access the dashboard.
        </CardDescription>
      </CardHeader>

      <LoginForm />
    </>
  )
}

const LoginForm: React.FC = () => {
  const turnstileWidgetId = useTurnstile()
  const { trpcClient, queryClient } = useTRPC()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: { identifier: '', password: '' },
    schema: SignInDto.input,
    onSubmit: async (data, event) => {
      await verifyTurnstile(event as unknown as React.SubmitEvent)
      return trpcClient.identity.auth.signIn.mutate(data)
    },
    onSuccess: () => [
      queryClient.invalidateQueries({
        queryKey: [['auth', 'currentUser'], { type: 'query' }],
      }),
      toast.success({ message: 'Logged in successfully!' }),
      setTimeout(() => navigate('/'), 200),
    ],
    onError: (error) => {
      toast.error({ message: error.message })
      resetTurnstile(turnstileWidgetId)
    },
  })

  return (
    <CardContent
      id={form.formId}
      className='flex flex-col gap-5'
      render={<form onSubmit={form.handleSubmit} />}
    >
      <form.Field
        name='identifier'
        render={({ field, meta }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={field.id}>Identifier</FieldLabel>
            <Input
              {...field}
              placeholder='Enter your username or email'
              disabled={form.state.isPending}
            />
            <FieldError id={meta.errorId} errors={meta.errors} />
          </Field>
        )}
      />

      <form.Field
        name='password'
        render={({ field, meta }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={field.id}>Password</FieldLabel>
            <Input {...field} type='password' disabled={form.state.isPending} />
            <FieldError id={meta.errorId} errors={meta.errors} />
          </Field>
        )}
      />

      <Field>
        <div
          className='cf-turnstile'
          data-sitekey={env.VITE_TURNSTILE_SITE_KEY}
        />

        <Button type='submit' disabled={form.state.isPending}>
          Login
        </Button>
      </Field>
    </CardContent>
  )
}
