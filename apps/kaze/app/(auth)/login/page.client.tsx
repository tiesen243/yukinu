'use client'

import { useRouter } from 'next/navigation'

import { useSession } from '@yuki/auth/react'
import { Button } from '@yuki/ui/button'
import { useForm } from '@yuki/ui/form'
import { Input } from '@yuki/ui/input'
import { toast } from '@yuki/ui/sonner'
import { signInSchema } from '@yuki/validators/auth'

export const LoginForm: React.FC = () => {
  const { signIn } = useSession()
  const router = useRouter()

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validator: signInSchema,
    onSubmit: (values) => signIn('credentials', values),
    onSuccess: () => {
      toast.success('You have successfully logged in!')
      router.push('/')
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

      <form.Field
        name='password'
        render={({ field, meta }) => (
          <div id={meta.id} className='grid gap-2'>
            <form.Label>Password</form.Label>
            <form.Control {...field}>
              <Input type='password' placeholder='********' />
            </form.Control>
            <form.Message />
          </div>
        )}
      />

      <Button disabled={form.state.isPending}>Login</Button>
    </form>
  )
}
