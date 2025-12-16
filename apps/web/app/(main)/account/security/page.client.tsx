'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@yukinu/ui/alert-dialog'
import { Button } from '@yukinu/ui/button'
import { Checkbox } from '@yukinu/ui/checkbox'
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
import { XIcon } from '@yukinu/ui/icons'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { AuthValidators } from '@yukinu/validators/auth'

import { useTRPC, useTRPCClient } from '@/lib/trpc/react'

export const SessionsList: React.FC = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.auth.allSessions.queryOptions({}))

  return data.map((session) => (
    <SessionItem key={session.id} session={session} />
  ))
}

export const SessionsListSkeleton: React.FC = () => {
  return Array.from({ length: 3 }, (_, index) => (
    <div
      key={index}
      className='relative flex animate-pulse flex-col gap-2 border-b pb-4 last:border-0'
    >
      <div className='text-sm text-muted-foreground'>User Agent</div>
      <div className='w-3/4 rounded-md bg-muted'>&nbsp;</div>
      <div className='text-sm text-muted-foreground'>IP Address</div>
      <div className='w-1/2 rounded-md bg-muted'>&nbsp;</div>
      <p className='text-sm text-muted-foreground'>Created At</p>
      <div className='w-1/3 rounded-md bg-muted'>&nbsp;</div>
    </div>
  ))
}

const SessionItem: React.FC<{
  session: AuthValidators.AllSessionsOutput[number]
}> = ({ session }) => {
  const trpc = useTRPC()
  const { mutate, isPending } = useMutation({
    ...trpc.auth.deleteSession.mutationOptions(),
    meta: { filter: trpc.auth.allSessions.queryFilter() },
    onSuccess: () => toast.success('Logged out of session successfully'),
    onError: ({ message }) =>
      toast.error('Failed to log out of session', { description: message }),
  })

  return (
    <div className='relative flex flex-col gap-2 border-b pb-4 last:border-0'>
      <div className='text-sm text-muted-foreground'>User Agent</div>
      <p className='font-mono break-all'>{session.userAgent}</p>
      <div className='text-sm text-muted-foreground'>IP Address</div>
      <p className='font-mono'>{session.ipAddress}</p>
      <p className='text-sm text-muted-foreground'>Created At</p>
      <p className='font-mono'>
        {new Date(session.createdAt).toLocaleString()}
      </p>

      <AlertDialog>
        <AlertDialogTrigger
          className='absolute top-0 right-0'
          render={
            <Button variant='outline' size='icon-sm'>
              <XIcon />
            </Button>
          }
        />

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to log out of this session?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will log you out of the session on the device with IP
              address {session.ipAddress} and user agent &quot;
              {session.userAgent}&quot;. You will need to log in again to access
              your account from that device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant='destructive'
              onClick={() => {
                mutate({ sessionId: session.id })
              }}
              disabled={isPending}
            >
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export const ChangePasswordForm: React.FC = () => {
  const trpc = useTRPCClient()
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      isLogOut: true,
    },
    schema: AuthValidators.changePasswordInput.omit({ userId: true }),
    onSubmit: trpc.auth.changePassword.mutate,
    onSuccess: () => {
      toast.success('Password changed successfully')
      if (form.state.getValues().isLogOut) router.push('/login')
    },
    onError: ({ message }) =>
      toast.error('Failed to change password', { description: message }),
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <FieldSet>
        <FieldLegend>Change Password</FieldLegend>
        <FieldDescription>
          Change your account password regularly to help keep your account
          secure.
        </FieldDescription>

        <FieldGroup>
          <form.Field
            name='currentPassword'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={meta.fieldId}>Current Password</FieldLabel>
                <Input
                  {...field}
                  type='password'
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
                <FieldLabel htmlFor={meta.fieldId}>New Password</FieldLabel>
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
                <FieldLabel htmlFor={meta.fieldId}>
                  Confirm New Password
                </FieldLabel>
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
            name='isLogOut'
            render={({
              meta,
              field: { value, onChange, onBlur: _, ...field },
            }) => (
              <Field
                orientation='horizontal'
                data-invalid={meta.errors.length > 0}
              >
                <Checkbox
                  {...field}
                  checked={value}
                  onCheckedChange={(value) => {
                    onChange(value)
                  }}
                />
                <FieldLabel htmlFor={meta.fieldId}>
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

export const DeleteAccountButton: React.FC = () => {
  const trpc = useTRPC()
  const router = useRouter()

  const { mutateAsync } = useMutation({
    ...trpc.auth.deleteAccount.mutationOptions(),
    onSuccess: () => toast.success('Account deleted successfully'),
    onError: ({ message }) =>
      toast.error('Failed to delete account', { description: message }),
  })

  const form = useForm({
    defaultValues: {
      password: '',
    },
    schema: AuthValidators.deleteAccountInput.omit({ userId: true }),
    onSubmit: mutateAsync,
    onSuccess: () => {
      router.push('/login')
    },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className='w-full'
        render={<Button variant='destructive'>Delete Account</Button>}
      />

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

        <form.Field
          name='password'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={meta.fieldId}>
                Confirm with Password
              </FieldLabel>
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
            variant='destructive'
            disabled={form.state.isPending}
            onClick={form.handleSubmit}
          >
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
