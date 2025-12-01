import { useNavigate } from 'react-router'

import { useSession } from '@yukinu/auth/react'
import { Button } from '@yukinu/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { AuthValidators } from '@yukinu/validators/auth'

export const LoginForm: React.FC = () => {
  const { signIn } = useSession()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      identifier: '',
      password: '',
    },
    schema: AuthValidators.loginInput,
    onSubmit: signIn,
    onError: ({ message }) => toast.error(message),
    onSuccess: () => {
      toast.success('Logged in successfully!')
      void navigate('/')
    },
  })

  return (
    <FieldGroup>
      <form.Field
        name='identifier'
        render={({ meta, field }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={meta.fieldId}>Username or Email</FieldLabel>
            <Input {...field} placeholder='Enter your username or email' />
            <FieldError errors={meta.errors} />
          </Field>
        )}
      />

      <form.Field
        name='password'
        render={({ meta, field }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={meta.fieldId}>Password</FieldLabel>
            <Input
              {...field}
              type='password'
              placeholder='Enter your password'
            />
            <FieldError errors={meta.errors} />
          </Field>
        )}
      />

      <Field>
        <Button
          type='submit'
          onClick={form.handleSubmit}
          disabled={form.state.isPending}
        >
          {form.state.isPending ? 'Logging in...' : 'Log In'}
        </Button>
      </Field>
    </FieldGroup>
  )
}
