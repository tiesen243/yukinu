'use client'

import { Button } from '@yukinu/ui/button'
import { Field, FieldError, FieldLabel, FieldSet } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/toast'
import { registerInput } from '@yukinu/validators/auth'

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
    schema: registerInput,
    onSubmit: trpc.auth.register.mutate,
    onSuccess: () => {
      toast.add({
        type: 'success',
        title: 'Registration successful!',
        description: 'Please check your email to verify your account.',
      })
    },
    onError: ({ message }) =>
      toast.add({
        type: 'error',
        title: 'Registration failed',
        description: message,
      }),
  })

  return (
    <form id={form.formId} className='px-6' onSubmit={form.handleSubmit}>
      <FieldSet>
        <legend className='sr-only'>Create a new account</legend>

        <Field orientation='horizontal'>
          <form.Field
            name='username'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Username</FieldLabel>
                <Input {...field} placeholder='Enter your username' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='email'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Email</FieldLabel>
                <Input {...field} type='email' placeholder='Enter your email' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />
        </Field>

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

        <form.Field
          name='confirmPassword'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={field.id}>Confirm Password</FieldLabel>
              <Input
                {...field}
                type='password'
                placeholder='Confirm your password'
              />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <Field>
          <Button type='submit' disabled={form.state.isPending}>
            {form.state.isPending ? 'Registering...' : 'Register'}
          </Button>
        </Field>
      </FieldSet>
    </form>
  )
}
