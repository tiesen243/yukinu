'use client'

import { useRouter } from 'next/navigation'

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

import { useTRPCClient } from '@/trpc/react'

export const RegisterForm: React.FC = () => {
  const router = useRouter()
  const trpcClient = useTRPCClient()

  const form = useForm({
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    schema: UserModel.registerBody,
    onSubmit: trpcClient.user.register.mutate,
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      toast.success('Account created successfully!')
      router.push('/login')
    },
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <FieldSet>
        <FieldLegend>Create an account</FieldLegend>
        <FieldDescription>
          Fill in the details below to create your account.
        </FieldDescription>

        <FieldGroup>
          <FormField
            control={form.control}
            name='email'
            render={({ meta, field, state }) => (
              <Field data-invalid={state.hasError}>
                <FieldLabel htmlFor={meta.fieldId}>Email</FieldLabel>
                <Input
                  {...field}
                  type='email'
                  placeholder='example@yukinu.com'
                />
                <FieldError id={meta.errorId} errors={state.errors} />
              </Field>
            )}
          />

          <FormField
            control={form.control}
            name='username'
            render={({ meta, field, state }) => (
              <Field data-invalid={state.hasError}>
                <FieldLabel htmlFor={meta.fieldId}>Username</FieldLabel>
                <Input {...field} placeholder='yourusername' />
                <FieldError id={meta.errorId} errors={state.errors} />
              </Field>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ meta, field, state }) => (
              <Field data-invalid={state.hasError}>
                <FieldLabel htmlFor={meta.fieldId}>Password</FieldLabel>
                <Input
                  {...field}
                  type='password'
                  placeholder='Enter your password'
                />
                <FieldError id={meta.errorId} errors={state.errors} />
              </Field>
            )}
          />

          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ meta, field, state }) => (
              <Field data-invalid={state.hasError}>
                <FieldLabel htmlFor={meta.fieldId}>Confirm Password</FieldLabel>
                <Input
                  {...field}
                  type='password'
                  placeholder='Re-enter your password'
                />
                <FieldError id={meta.errorId} errors={state.errors} />
              </Field>
            )}
          />

          <Field>
            <Button type='submit' disabled={form.state.isPending}>
              {form.state.isPending ? 'Creating account...' : 'Create account'}
            </Button>
          </Field>

          <FieldDescription>
            Already have an account?{' '}
            <Button
              type='button'
              variant='link'
              size='sm'
              className='cursor-pointer p-0'
              tabIndex={-1}
              onClick={() => {
                router.push('/login')
              }}
            >
              Login
            </Button>
          </FieldDescription>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
