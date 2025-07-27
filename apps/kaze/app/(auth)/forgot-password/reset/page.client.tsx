'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@yuki/ui/button'
import { useForm } from '@yuki/ui/form'
import { Input } from '@yuki/ui/input'
import { toast } from '@yuki/ui/sonner'
import { resetPasswordSchema } from '@yuki/validators/auth'

import { useTRPC } from '@/trpc/react'

export const ResetPasswordForm: React.FC<{ token: string }> = ({ token }) => {
  const router = useRouter()
  const { trpcClient } = useTRPC()
  const form = useForm({
    defaultValues: { token, newPassword: '', confirmNewPassword: '' },
    validator: resetPasswordSchema,
    onSubmit: trpcClient.auth.resetPassword.mutate,
    onSuccess: () => {
      toast.success(
        'Your password has been reset successfully. You can now sign in with your new password.',
      )
      router.push('/login')
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
        name='newPassword'
        render={({ field, meta }) => (
          <div id={meta.id} className='grid gap-2'>
            <form.Label>New Password</form.Label>
            <form.Control {...field}>
              <Input type='password' placeholder='Enter your new password' />
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
              <Input type='password' placeholder='Confirm your new password' />
            </form.Control>
            <form.Message />
          </div>
        )}
      />

      <Button disabled={form.state.isPending}>Reset Password</Button>
    </form>
  )
}
