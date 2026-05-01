import { SignInDto } from '@yukinu/api/identity'
import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/toast'
import { Link, useNavigate, useSubmit } from 'react-router'

import { env } from '@/env'
import { useTRPC } from '@/lib/trpc/react'
import { getWebUrl } from '@/lib/utils'
import { verifyTurnstile } from '@/lib/verify-turnstile'

import type { Route } from './+types/login'

export const action = ({ request }: Route.ActionArgs) =>
  verifyTurnstile(request)

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const navigate = useNavigate()
  const submit = useSubmit()
  const { trpcClient } = useTRPC()

  const form = useForm({
    defaultValues: { identifier: '', password: '' },
    schema: SignInDto.input,
    onSubmit: (data, event) => {
      if (!(event && event.target instanceof HTMLFormElement)) return
      submit(event.target, { method: 'post' })

      if (actionData?.success === false) throw new Error(actionData.message)
      return trpcClient.identity.auth.signIn.mutate(data)
    },
    onError: ({ message }) =>
      toast.add({ type: 'error', title: 'Login failed', description: message }),
    onSuccess: () => {
      toast.add({ type: 'success', title: 'Logged in successfully!' })
      void navigate('/')
    },
  })

  return (
    <main className='grid min-h-dvh place-items-center'>
      <h1 className='sr-only'>Login page</h1>

      <Card
        id={form.formId}
        className='w-full max-w-xl bg-background shadow-none ring-0 sm:bg-card sm:shadow-sm sm:ring-1'
        render={<form onSubmit={form.handleSubmit} />}
      >
        <FieldSet className='px-4'>
          <FieldLegend>Login</FieldLegend>
          <FieldDescription>
            Welcome back! Please enter your credentials to log in.
          </FieldDescription>

          <FieldGroup>
            <form.Field
              name='identifier'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.id}>Username or Email</FieldLabel>
                  <Input
                    {...field}
                    placeholder='Enter your username or email'
                  />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

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

            <Field>
              <div
                className='cf-turnstile'
                data-sitekey={env.VITE_TURNSTILE_SITE_KEY}
              />

              <Button type='submit' disabled={form.state.isPending}>
                {form.state.isPending ? 'Logging in...' : 'Log In'}
              </Button>
            </Field>
          </FieldGroup>

          <FieldDescription>
            Don&apos;t have an account?{' '}
            <Link to={`${getWebUrl()}/register`}>Register here.</Link>
          </FieldDescription>
        </FieldSet>
      </Card>
    </main>
  )
}
