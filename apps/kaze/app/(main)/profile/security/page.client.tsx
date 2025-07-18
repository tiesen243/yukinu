'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'

import type { Session } from '@yuki/auth'
import { Button } from '@yuki/ui/button'
import { Checkbox } from '@yuki/ui/checkbox'
import { useForm } from '@yuki/ui/form'
import { Input } from '@yuki/ui/input'
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@yuki/ui/responsive-dialog'
import { toast } from '@yuki/ui/sonner'
import {
  changePasswordSchema,
  deleteAccountSchema,
} from '@yuki/validators/auth'

import { useTRPC } from '@/trpc/react'

export const ChangePasswordForm: React.FC = () => {
  const { trpcClient } = useTRPC()
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      isLogoutAll: true,
    },
    validator: changePasswordSchema,
    onSubmit: trpcClient.auth.changePassword.mutate,
    onSuccess: async () => {
      toast.success('Password changed successfully!')
      await new Promise((resolve) => setTimeout(resolve, 200))
      router.refresh()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <form
      className='grid gap-4'
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name='currentPassword'
        render={({ field, meta }) => (
          <div id={meta.id} className='grid gap-2'>
            <form.Label>Current Password</form.Label>
            <form.Control {...field}>
              <Input type='password' placeholder='Current Password' />
            </form.Control>
            <form.Description>
              Leave empty if you don't have a current password.
            </form.Description>
            <form.Message />
          </div>
        )}
      />

      <form.Field
        name='newPassword'
        render={({ field, meta }) => (
          <div id={meta.id} className='grid gap-2'>
            <form.Label>New Password</form.Label>
            <form.Control {...field}>
              <Input type='password' placeholder='New Password' />
            </form.Control>
            <form.Message />
          </div>
        )}
      />

      <form.Field
        name='confirmNewPassword'
        render={({ field, meta }) => (
          <div id={meta.id} className='grid gap-2'>
            <form.Label>Confirm New Password</form.Label>
            <form.Control {...field}>
              <Input type='password' placeholder='Confirm New Password' />
            </form.Control>
            <form.Message />
          </div>
        )}
      />

      <form.Field
        name='isLogoutAll'
        render={({ field, meta }) => (
          <div id={meta.id} className='flex items-center gap-2'>
            <form.Control onBlur={field.onBlur}>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </form.Control>
            <form.Label>Logout from all devices</form.Label>
          </div>
        )}
      />

      <Button className='w-full' disabled={form.state.isPending}>
        Change Password
      </Button>
    </form>
  )
}

export const SessionList: React.FC = () => {
  const { trpc } = useTRPC()
  const { data, isLoading } = useQuery(trpc.auth.listSessions.queryOptions())

  return (
    <div className='grid gap-4'>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        data?.map((session) => (
          <SessionCard key={session.token} session={session} />
        ))
      )}
    </div>
  )
}

const SessionCard: React.FC<{ session: Session }> = ({ session }) => {
  const { trpc, queryClient } = useTRPC()
  const { mutate, isPending } = useMutation({
    ...trpc.auth.deleteSession.mutationOptions(),
    onSuccess: async () => {
      toast.success('Session deleted successfully!')
      await queryClient.invalidateQueries(trpc.auth.listSessions.queryFilter())
    },
  })

  return (
    <div className='flex flex-col justify-between gap-4 rounded-lg border bg-card p-4 shadow-sm md:flex-row md:items-center'>
      <div className='space-y-1'>
        <div className='text-sm font-medium'>
          User Agent: {session.userAgent}
        </div>
        <div className='text-xs text-muted-foreground'>
          Expires: {new Date(session.expires).toLocaleString()}
        </div>
      </div>
      <Button
        variant='destructive'
        size='sm'
        disabled={isPending}
        onClick={() => {
          mutate({ token: session.token })
        }}
      >
        Delete Session
      </Button>
    </div>
  )
}

export const DeleteAccountForm: React.FC = () => {
  const { trpcClient } = useTRPC()
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      password: '',
      confirm: '',
    },
    validator: deleteAccountSchema,
    onSubmit: trpcClient.auth.deleteAccount.mutate,
    onSuccess: async () => {
      toast.success('Account deleted successfully!')
      await new Promise((resolve) => setTimeout(resolve, 200))
      router.refresh()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <Button variant='destructive' className='w-full'>
          Delete Account
        </Button>
      </ResponsiveDialogTrigger>

      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            Are you sure you want to delete your account?
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            This action cannot be undone. All your data will be permanently
            deleted.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          className='grid gap-4 p-4 md:p-0'
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field
            name='password'
            render={({ field, meta }) => (
              <div id={meta.id} className='grid gap-2'>
                <form.Label>Password</form.Label>
                <form.Control {...field}>
                  <Input type='password' placeholder='Your Password' />
                </form.Control>
                <form.Message />
              </div>
            )}
          />

          <form.Field
            name='confirm'
            render={({ field, meta }) => (
              <div id={meta.id} className='grid gap-2'>
                <form.Label>Type "Delete my account" to confirm</form.Label>
                <form.Control {...field}>
                  <Input placeholder='Delete my account' />
                </form.Control>
                <form.Message />
              </div>
            )}
          />

          <div className='flex flex-col items-center justify-end gap-2 md:flex-row'>
            <ResponsiveDialogClose asChild>
              <Button
                type='button'
                variant='outline'
                className='w-full md:w-auto'
                disabled={form.state.isPending}
              >
                Cancel
              </Button>
            </ResponsiveDialogClose>
            <Button
              type='submit'
              variant='destructive'
              className='w-full md:w-auto'
              disabled={form.state.isPending}
            >
              Delete Account
            </Button>
          </div>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
