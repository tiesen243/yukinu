'use client'

import { useMutation } from '@tanstack/react-query'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@yukinu/ui/alert-dialog'
import { Button } from '@yukinu/ui/button'
import { Field, FieldLabel, FieldError } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/toast'
import { deleteAccountInput } from '@yukinu/validators/auth'
import { useRouter } from 'next/navigation'

import { useTRPC } from '@/lib/trpc/react'

export const DeleteAccountButton: React.FC = () => {
  const trpc = useTRPC()
  const router = useRouter()

  const { mutateAsync } = useMutation({
    ...trpc.security.deleteAccount.mutationOptions(),
    onSuccess: () =>
      toast.add({
        type: 'success',
        title: 'Account deleted successfully',
      }),
    onError: ({ message }) =>
      toast.add({
        type: 'error',
        title: 'Failed to delete account',
        description: message,
      }),
  })

  const form = useForm({
    defaultValues: {
      password: '',
    },
    schema: deleteAccountInput.omit({ userId: true }),
    onSubmit: mutateAsync,
    onSuccess: () => {
      router.push('/login')
    },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button className='w-full' variant='destructive' />}
      >
        Delete Account
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete your account?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You can contact support to recover your account within 30 days.
            After that, your account and all associated data will be permanently
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form id={form.formId} onSubmit={form.handleSubmit} />

        <form.Field
          name='password'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={field.id}>Confirm with Password</FieldLabel>
              <Input
                {...field}
                type='password'
                placeholder='Enter your password'
              />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <AlertDialogFooter>
          <AlertDialogCancel disabled={form.state.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            form={form.formId}
            variant='destructive'
            disabled={form.state.isPending}
          >
            {form.state.isPending ? 'Deleting...' : 'Delete Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
