'use client'

import { Button } from '@yukinu/ui/button'
import { Checkbox } from '@yukinu/ui/checkbox'
import {
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/toast'
import { changePasswordInput } from '@yukinu/validators/auth';
import type { ChangePasswordInput } from '@yukinu/validators/auth';
import { useRouter } from 'next/navigation'

import { useTRPCClient } from '@/lib/trpc/react'

export const ChangePasswordForm: React.FC = () => {
  const trpc = useTRPCClient()
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      userId: null,
      currentPassword: null,
      newPassword: '',
      confirmNewPassword: '',
      isLogout: true,
    } as ChangePasswordInput,
    schema: changePasswordInput,
    onSubmit: trpc.security.changePassword.mutate,
    onSuccess: () => {
      toast.add({ type: 'success', title: 'Password changed successfully' })
      if (form.state.values.isLogout) router.push('/login')
    },
    onError: ({ message }) =>
      toast.add({
        type: 'error',
        title: 'Failed to change password',
        description: message,
      }),
  })

  return (
    <form id={form.formId} onSubmit={form.handleSubmit}>
      <FieldSet>
        <FieldLegend>Change Password</FieldLegend>
        <FieldDescription>
          Change your account password regularly to help keep your account
          secure.
        </FieldDescription>

        <FieldGroup>
          <form.Field
            name='currentPassword'
            render={({ meta, field: { value, ...field } }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Current Password</FieldLabel>
                <Input
                  {...field}
                  type='password'
                  value={value ?? ''}
                  placeholder='Enter current password'
                  autoComplete='current-password'
                />
                <FieldDescription>
                  Leave blank if you do not have a password.
                </FieldDescription>
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='newPassword'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>New Password</FieldLabel>
                <Input
                  {...field}
                  type='password'
                  placeholder='Enter new password'
                  autoComplete='new-password'
                />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='confirmNewPassword'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Confirm New Password</FieldLabel>
                <Input
                  {...field}
                  type='password'
                  placeholder='Confirm new password'
                  autoComplete='new-password'
                />

                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='isLogout'
            render={({ meta, field: { value, onChange, ...field } }) => (
              <Field
                orientation='horizontal'
                data-invalid={meta.errors.length > 0}
              >
                <Checkbox
                  {...field}
                  checked={value}
                  onCheckedChange={onChange}
                />
                <FieldLabel htmlFor={field.id}>
                  Log out of all other sessions
                </FieldLabel>
              </Field>
            )}
          />

          <Field>
            <Button type='submit' disabled={form.state.isPending}>
              {form.state.isPending ? 'Changing...' : 'Change Password'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
