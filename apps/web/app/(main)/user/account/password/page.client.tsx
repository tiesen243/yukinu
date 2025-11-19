'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@yukinu/ui/button'
import { Checkbox } from '@yukinu/ui/checkbox'
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
import { AuthModels } from '@yukinu/validators/auth'

import { useTRPCClient } from '@/trpc/react'

export const ChangePasswordForm: React.FC = () => {
  const trpcClient = useTRPCClient()
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      currentPassword: undefined,
      newPassword: '',
      confirmNewPassword: '',
      isLogOutOtherSessions: true,
    } as Omit<AuthModels.ChangePasswordInput, 'userId'>,
    schema: AuthModels.changePasswordInput.omit({ userId: true }),
    onSubmit: trpcClient.auth.changePassword.mutate,
    onSuccess: () => {
      toast.success('Password changed successfully')
      router.refresh()
    },
    onError: (error) => toast.error(error.message),
  })

  return (
    <FieldGroup className='px-4'>
      <form.Field
        name='currentPassword'
        render={({ field, meta }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={meta.fieldId}>Current Password</FieldLabel>
            <Input {...field} type='password' autoComplete='current-password' />
            <FieldDescription>
              Leave blank if you registered using a social account.
            </FieldDescription>
            <FieldError errors={meta.errors} />
          </Field>
        )}
      />

      <form.Field
        name='newPassword'
        render={({ field, meta }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={meta.fieldId}>New Password</FieldLabel>
            <Input {...field} type='password' autoComplete='new-password' />
            <FieldError errors={meta.errors} />
          </Field>
        )}
      />

      <form.Field
        name='confirmNewPassword'
        render={({ field, meta }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={meta.fieldId}>Confirm New Password</FieldLabel>
            <Input {...field} type='password' autoComplete='new-password' />
            <FieldError errors={meta.errors} />
          </Field>
        )}
      />

      <form.Field
        name='isLogOutOtherSessions'
        render={({ field, meta }) => (
          <Field data-invalid={meta.errors.length > 0} orientation='horizontal'>
            <Checkbox
              id={meta.fieldId}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <FieldLabel htmlFor={meta.fieldId}>
              Log out from other sessions
            </FieldLabel>
          </Field>
        )}
      />

      <Field>
        <Button
          type='submit'
          onClick={form.handleSubmit}
          disabled={form.state.isPending}
        >
          Change Password
        </Button>
      </Field>
    </FieldGroup>
  )
}
