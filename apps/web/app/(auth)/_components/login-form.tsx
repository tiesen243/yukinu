'use client'

import { useRouter } from 'next/navigation'

import { useSession } from '@yukinu/auth/react'
import { Button } from '@yukinu/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  useForm,
} from '@yukinu/ui/form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { UserModel } from '@yukinu/validators/user'

export const LoginForm: React.FC = () => {
  const { signIn } = useSession()
  const router = useRouter()

  const form = useForm({
    defaultValues: { identifier: '', password: '' },
    validator: UserModel.loginBody,
    onSubmit: (data) => signIn('credentials', data),
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('Logged in successfully!')
      router.push('/')
    },
  })

  return (
    <form className='grid gap-4' onSubmit={form.handleSubmit}>
      <FormField
        control={form.control}
        name='identifier'
        render={({ field }) => (
          <div className='grid gap-2'>
            <FormLabel>Email or Username</FormLabel>
            <FormControl {...field} disabled={form.state.isPending}>
              <Input placeholder='Enter your email or username' />
            </FormControl>
            <FormDescription>
              You can use either your email address or username to log in.
            </FormDescription>
            <FormMessage />
          </div>
        )}
      />

      <FormField
        control={form.control}
        name='password'
        render={({ field }) => (
          <div className='grid gap-2'>
            <div className='flex items-center justify-between gap-4'>
              <FormLabel>Password</FormLabel>
              <Button
                type='button'
                variant='link'
                size='sm'
                className='cursor-pointer p-0'
                tabIndex={-1}
                onClick={() => {
                  router.push('/forgot-password')
                }}
              >
                Forgot your password?
              </Button>
            </div>
            <FormControl {...field} disabled={form.state.isPending}>
              <Input type='password' placeholder='Enter your password' />
            </FormControl>
            <FormMessage />
          </div>
        )}
      />

      <Button type='submit' disabled={form.state.isPending}>
        {form.state.isPending ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  )
}
