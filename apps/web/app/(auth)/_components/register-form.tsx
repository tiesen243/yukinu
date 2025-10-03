'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@yukinu/ui/button'
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  useForm,
} from '@yukinu/ui/form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { UserModel } from '@yukinu/validators/user'

import { useTRPCClient } from '@/trpc/react'

export const RegisterForm: React.FC = () => {
  const trpcClient = useTRPCClient()
  const router = useRouter()

  const form = useForm({
    defaultValues: { email: '', username: '', password: '' },
    validator: UserModel.registerBody,
    onSubmit: trpcClient.user.register.mutate,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('Account created successfully!')
      router.push('/login')
    },
  })

  return (
    <form className='grid gap-4' onSubmit={form.handleSubmit}>
      <FormField
        control={form.control}
        name='email'
        render={({ field }) => (
          <div className='grid gap-2'>
            <FormLabel>Email</FormLabel>
            <FormControl {...field} disabled={form.state.isPending}>
              <Input type='email' placeholder='example@yukinu.com' />
            </FormControl>
            <FormMessage />
          </div>
        )}
      />

      <FormField
        control={form.control}
        name='username'
        render={({ field }) => (
          <div className='grid gap-2'>
            <FormLabel>Username</FormLabel>
            <FormControl {...field} disabled={form.state.isPending}>
              <Input type='text' placeholder='yukinu' />
            </FormControl>
            <FormMessage />
          </div>
        )}
      />

      <FormField
        control={form.control}
        name='password'
        render={({ field }) => (
          <div className='grid gap-2'>
            <FormLabel>Password</FormLabel>
            <FormControl {...field} disabled={form.state.isPending}>
              <Input type='password' placeholder='********' />
            </FormControl>
            <FormMessage />
          </div>
        )}
      />

      <Button type='submit' disabled={form.state.isPending}>
        {form.state.isPending ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  )
}
