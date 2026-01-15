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
import { toast } from '@yukinu/ui/sonner'
import * as AuthValidators from '@yukinu/validators/auth'
import { Link, useNavigate } from 'react-router'

import { getWebUrl } from '@/lib/utils'

export default function LoginPage() {
  const { signIn } = useSession()
  const navigate = useNavigate()

  const { formId, FormField, handleSubmit, state } = useForm({
    defaultValues: {
      identifier: '',
      password: '',
    },
    schema: AuthValidators.loginInput,
    onSubmit: signIn,
    onError: ({ message }) =>
      toast.error('Login failed', { description: message }),
    onSuccess: () => {
      toast.success('Logged in successfully!')
      void navigate('/')
    },
  })

  return (
    <main className='grid min-h-dvh place-items-center'>
      <h1 className='sr-only'>Login page</h1>

      <Card
        id={formId}
        className='w-full max-w-xl bg-background shadow-none ring-0 sm:bg-card sm:shadow-sm sm:ring-1'
        render={<form onSubmit={handleSubmit} />}
      >
        <FieldSet className='px-6'>
          <FieldLegend>Login</FieldLegend>
          <FieldDescription>
            Welcome back! Please enter your credentials to log in.
          </FieldDescription>

          <FieldGroup>
            <FormField
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

            <FormField
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
              <Button type='submit' disabled={state.isPending}>
                {state.isPending ? 'Logging in...' : 'Log In'}
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
