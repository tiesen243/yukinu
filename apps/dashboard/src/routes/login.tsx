import { useNavigate } from 'react-router'

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
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { AuthValidators } from '@yukinu/validators/auth'

export default function LoginPage() {
  return (
    <main className='grid min-h-dvh place-items-center'>
      <form className='w-full max-w-xl rounded-xl p-6 text-card-foreground sm:border sm:bg-card sm:shadow-sm'>
        <FieldSet>
          <FieldLegend>Login</FieldLegend>
          <FieldDescription>
            Welcome back! Please enter your credentials to log in.
          </FieldDescription>

          <LoginForm />
        </FieldSet>
      </form>
    </main>
  )
}

const LoginForm: React.FC = () => {
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
