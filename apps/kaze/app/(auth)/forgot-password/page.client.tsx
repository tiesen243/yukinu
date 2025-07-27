'use client'

import { Button } from '@yuki/ui/button'
import { useForm } from '@yuki/ui/form'
import { Input } from '@yuki/ui/input'
import { toast } from '@yuki/ui/sonner'
import { forgotPasswordSchema } from '@yuki/validators/auth'

import { useTRPC } from '@/trpc/react'

export const ForgotPasswordForm: React.FC = () => {
  const { trpcClient } = useTRPC()
  const form = useForm({
    defaultValues: { email: '' },
    validator: forgotPasswordSchema,
    onSubmit: trpcClient.auth.forgotPassword.mutate,
    onSuccess: () => {
      toast.success(
        'If your email is registered, you will receive a password reset link shortly.',
      )
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
        name='email'
        render={({ field, meta }) => (
          <div id={meta.id} className='grid gap-2'>
            <form.Label>Email</form.Label>
            <form.Control {...field}>
              <Input type='email' placeholder='yuki@example.com' />
            </form.Control>
            <form.Message />
          </div>
        )}
      />

      <Button disabled={form.state.isPending}>Send Reset Link</Button>
    </form>
  )
}
