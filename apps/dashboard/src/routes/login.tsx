// oxlint-disable no-shadow

import { useQueryClient } from '@tanstack/react-query'
import { SignInDto } from '@yukinu/api/identity'
import { Button } from '@yukinu/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yukinu/ui/card'
import { Field, FieldError, FieldLabel } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/toast'
import { useNavigate, useSubmit } from 'react-router'

import { env } from '@/lib/env'
import { createMetadata } from '@/lib/metadata'
import { useTRPC } from '@/lib/trpc'
import { verifyTurnstile } from '@/lib/turnstile'

import type { Route } from './+types/login'

export const meta: Route.MetaFunction = () =>
  createMetadata({
    title: 'Login',
    openGraph: { url: '/login' },
  })

export const action = ({ request }: Route.ActionArgs) =>
  verifyTurnstile(request)

export default function LoginPage({ actionData }: Route.ComponentProps) {
  return (
    <main className='flex h-dvh flex-col items-center justify-center px-4'>
      <Card className='min-w-full md:max-w-xl md:min-w-xl'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Fill in your credentials to access the dashboard.
          </CardDescription>
        </CardHeader>

        <LoginForm actionData={actionData} />
      </Card>
    </main>
  )
}

const LoginForm: React.FC<Pick<Route.ComponentProps, 'actionData'>> = ({
  actionData,
}) => {
  const submit = useSubmit()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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
    onSuccess: () => [
      queryClient.invalidateQueries({
        queryKey: [['auth', 'currentUser'], { type: 'query' }],
      }),
      toast.success({ message: 'Logged in successfully!' }),
      setTimeout(() => navigate('/'), 200),
    ],
    onError: (error) => toast.error({ message: error.message }),
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
