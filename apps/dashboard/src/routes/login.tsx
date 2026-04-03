import { useSession } from '@yukinu/auth/react'
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
import * as AuthValidators from '@yukinu/validators/auth'
import { env } from '@yukinu/validators/env.vite'
import { useEffect } from 'react'
import { Link, useNavigate, useSubmit } from 'react-router'

import { getWebUrl } from '@/lib/utils'
import { verifyTurnstileToken } from '@/lib/verify-turnstile'

import type { Route } from './+types/login'

export async function action({
  request,
}: Route.ActionArgs): Promise<
  { success: true } | { success: false; message: string }
> {
  const formData = await request.formData()

  const token = formData.get('cf-turnstile-response')
  if (typeof token !== 'string')
    return { success: false, message: 'Turnstile token is missing or invalid' }

  try {
    return verifyTurnstileToken(token) as Promise<{ success: true }>
  } catch {
    return { success: false, message: 'Failed to verify Turnstile token' }
  }
}

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const { signIn } = useSession()
  const navigate = useNavigate()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    document.body.append(script)

    return () => {
      script.remove()
    }
  }, [])

  const submit = useSubmit()

  const form = useForm({
    defaultValues: { identifier: '', password: '' },
    schema: AuthValidators.loginInput,
    onSubmit: (data, event) => {
      if (!(event && event.target instanceof HTMLFormElement)) return
      submit(event.target, { method: 'post' })

      if (actionData?.success === false) throw new Error(actionData.message)
      return signIn(data)
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
