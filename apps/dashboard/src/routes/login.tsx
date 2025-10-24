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
import { AuthModel } from '@yukinu/validators/auth'

import { createMetadata } from '@/lib/metadata'

export const meta = () =>
  createMetadata({
    title: 'Login',
    description: 'Login to your account',
    openGraph: { url: '/login' },
  })

export default function LoginPage() {
  return (
    <main className='grid min-h-dvh place-items-center px-4'>
      <form className='w-full max-w-xl rounded-xl border border-transparent bg-background p-6 text-card-foreground sm:border-border sm:bg-card sm:shadow-sm'>
        <FieldSet>
          <FieldLegend>Login to your account</FieldLegend>
          <FieldDescription>
            Fill in your credentials to access your account.
          </FieldDescription>
          <LoginForm />
        </FieldSet>
      </form>
    </main>
  )
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const { signIn } = useSession()

  const form = useForm({
    defaultValues: { identifier: '', password: '' },
    schema: AuthModel.loginBody,
    onSubmit: (data) => signIn('credentials', data),
    onSuccess: () => {
      void navigate('/dashboard')
      toast.success('Successfully logged in')
    },
    onError: (error) => toast.error(error.message),
  })

  return (
    <FieldGroup>
      <form.Field
        name='identifier'
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
            <FieldLabel htmlFor={meta.fieldId}>Password</FieldLabel>
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
      </Field>
    </FieldGroup>
  )
}
