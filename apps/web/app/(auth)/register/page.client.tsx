'use client'

import { Button } from '@yukinu/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { AuthValidators } from '@yukinu/validators/auth'

import { useTRPCClient } from '@/lib/trpc/react'

export const RegisterForm: React.FC = () => {
  const trpc = useTRPCClient()

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    schema: AuthValidators.registerInput,
    onSubmit: trpc.auth.register.mutate,
    onSuccess: () => {
      toast.success('Registration successful!', {
        description: 'Please check your email to verify your account.',
      })
    },
    onError: ({ message }) =>
      toast.error('Registration failed', { description: message }),
  })

  return (
    <FieldGroup>
      <Field orientation='horizontal'>
        <form.Field
          name='username'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={meta.fieldId}>Username</FieldLabel>
              <Input {...field} placeholder='Enter your username' />
              <FieldError errors={meta.errors} />
            </Field>
          )}
        />

        <form.Field
          name='email'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={meta.fieldId}>Email</FieldLabel>
              <Input {...field} type='email' placeholder='Enter your email' />
              <FieldError errors={meta.errors} />
            </Field>
          )}
        />
      </Field>

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

      <form.Field
        name='confirmPassword'
        render={({ meta, field }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={meta.fieldId}>Confirm Password</FieldLabel>
            <Input
              {...field}
              type='password'
              placeholder='Confirm your password'
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
          {form.state.isPending ? 'Registering...' : 'Register'}
        </Button>
      </Field>
    </FieldGroup>
  )
}
