'use client'

import { useRouter } from 'next/navigation'

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
import { AuthValidator } from '@yukinu/validators/auth'

import { useTRPCClient } from '@/trpc/react'

export const RegisterForm: React.FC = () => {
  const trpcClient = useTRPCClient()
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    schema: AuthValidator.registerBody,
    onSubmit: trpcClient.auth.register.mutate,
    onSuccess: () => {
      router.push('/login')
      toast.success('Successfully registered')
    },
    onError: (error) => toast.error(error.message),
  })

  return (
    <FieldGroup>
      <form.Field
        name='username'
        render={({ meta, field }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={meta.fieldId}>Username</FieldLabel>
            <Input {...field} placeholder='yuki' />
            <FieldError id={meta.errorId} errors={meta.errors} />
          </Field>
        )}
      />

      <form.Field
        name='email'
        render={({ meta, field }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={meta.fieldId}>Email</FieldLabel>
            <Input {...field} type='email' placeholder='yuki@example.com' />
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

      <form.Field
        name='confirmPassword'
        render={({ meta, field }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={meta.fieldId}>Confirm Password</FieldLabel>
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
          {form.state.isPending ? 'Registering...' : 'Register'}
        </Button>
      </Field>

      <FieldDescription>
        Already have an account?{' '}
        <Button
          type='button'
          variant='link'
          size='sm'
          tabIndex={-1}
          onClick={() => {
            router.push('/login')
          }}
        >
          Login
        </Button>
      </FieldDescription>
    </FieldGroup>
  )
}
