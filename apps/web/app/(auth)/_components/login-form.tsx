'use client'

import { useRouter } from 'next/navigation'

import { useSession } from '@yukinu/auth/react'
import { Button } from '@yukinu/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@yukinu/ui/field'
import { FormField, useForm } from '@yukinu/ui/form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { UserModel } from '@yukinu/validators/user'

export const LoginForm: React.FC = () => {
  const { signIn } = useSession()
  const router = useRouter()

  const form = useForm({
    defaultValues: { identifier: '', password: '' },
    schema: UserModel.loginBody,
    onSubmit: (data) => signIn('credentials', data),
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      toast.success('Logged in successfully!')
      router.push('/')
    },
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <FieldSet>
        <FieldLegend>Login to your account</FieldLegend>
        <FieldDescription>
          Enter your email or username and password to access your account.
        </FieldDescription>

        <FieldGroup>
          <FormField
            control={form.control}
            name='identifier'
            render={({ meta, field, state }) => (
              <Field data-invalid={state.hasError}>
                <FieldLabel htmlFor={meta.fieldId}>
                  Email or Username
                </FieldLabel>
                <Input {...field} placeholder='Enter your email or username' />
                <FieldError id={meta.errorId} errors={state.errors} />
              </Field>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ meta, field, state }) => (
              <Field data-invalid={state.hasError}>
                <div className='flex items-center justify-between gap-4'>
                  <FieldLabel htmlFor={meta.fieldId}>Password</FieldLabel>
                  <Button
                    type='button'
                    variant='link'
                    size='sm'
                    className='cursor-pointer p-0'
                    tabIndex={-1}
                    onClick={() => {
                      router.push('/forgot-password')
                    }}
                  >
                    Forgot your password?
                  </Button>
                </div>
                <Input
                  {...field}
                  type='password'
                  placeholder='Enter your password'
                />
                <FieldError id={meta.errorId} errors={state.errors} />
              </Field>
            )}
          />

          <Button type='submit' disabled={form.state.isPending}>
            {form.state.isPending ? 'Logging in...' : 'Login'}
          </Button>
        </FieldGroup>

        <FieldDescription>
          Don't have an account?{' '}
          <Button
            type='button'
            variant='link'
            size='sm'
            className='cursor-pointer p-0'
            onClick={() => {
              router.push('/register')
            }}
          >
            Register here
          </Button>
          .
        </FieldDescription>
      </FieldSet>
    </form>
  )
}
