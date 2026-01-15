'use client'

import { useMutation } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import { Field } from '@yukinu/ui/field'
import { toast } from '@yukinu/ui/sonner'
import { useRouter } from 'next/navigation'

import { useTRPC } from '@/lib/trpc/react'

export const VerifyEmailForm: React.FC<{ token: string }> = ({ token }) => {
  const trpc = useTRPC()
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    ...trpc.auth.verifyEmail.mutationOptions(),
    onSuccess: () => {
      toast.success('Email verified successfully!', {
        description: 'You can now log in to your account.',
      })
      router.push('/login')
    },
    onError: ({ message }) =>
      toast.error('Email verification failed', { description: message }),
  })

  return (
    <form
      className='px-6'
      onSubmit={(e) => {
        e.preventDefault()
        mutate({ token })
      }}
    >
      <Field>
        <Button type='submit' disabled={isPending}>
          Verify Email
        </Button>
      </Field>
    </form>
  )
}
