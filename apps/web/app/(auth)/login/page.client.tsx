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
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { AuthModel } from '@yukinu/validators/auth'

export const LoginForm: React.FC = () => {
  const router = useRouter()
  const { signIn } = useSession()

  const form = useForm({
    defaultValues: { indentifier: '', password: '' },
    schema: AuthModel.loginBody,
    onSubmit: (data) => signIn('credentials', data),
    onSuccess: () => {
      router.push('/')
      toast.success('Successfully logged in')
    },
    onError: (error) => toast.error(error.message),
  })

  return (
    <FieldGroup>
      <form.Field
        name='indentifier'
        render={({ meta, field }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={meta.fieldId}>Email or Username</FieldLabel>
            <Input {...field} placeholder='Your email or username' />
            <FieldError id={meta.errorId} errors={meta.errors} />
          </Field>
        )}
      />

      <form.Field
        name='password'
        render={({ meta, field }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <div className='flex items-center justify-between gap-4'>
              <FieldLabel htmlFor={meta.fieldId}>Password</FieldLabel>
              <Button
                type='button'
                variant='link'
                size='sm'
                tabIndex={-1}
                onClick={() => {
                  router.push('/forgot-password')
                }}
              >
                Forgot password?
              </Button>
            </div>
            <Input {...field} type='password' />
            <FieldError id={meta.errorId} errors={meta.errors} />
          </Field>
        )}
      />

      <Field>
        <Button
          type='submit'
          onClick={form.handleSubmit}
          disabled={form.state.isPending}
        >
          {form.state.isPending ? 'Logging in...' : 'Login'}
        </Button>

        <FieldDescription>
          Don't have an account?{' '}
          <Button
            type='button'
            variant='link'
            size='sm'
            tabIndex={-1}
            onClick={() => {
              router.push('/register')
            }}
          >
            Register
          </Button>
        </FieldDescription>
      </Field>
    </FieldGroup>
  )
}
