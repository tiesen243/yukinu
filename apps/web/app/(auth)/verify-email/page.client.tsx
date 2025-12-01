'use client'

import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'

import { Button } from '@yukinu/ui/button'
import { Field } from '@yukinu/ui/field'
import { toast } from '@yukinu/ui/sonner'

import { useTRPC } from '@/lib/trpc/react'

export const VerifyEmailForm: React.FC<{ token: string }> = ({ token }) => {
  const trpc = useTRPC()
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    ...trpc.auth.verufyEmail.mutationOptions(),
    onError: ({ message }) => toast.error(message),
    onSuccess: () => {
      toast.success('Email verified successfully!', {
        description: 'You can now log in to your account.',
      })
      router.push('/login')
    },
  })

  return (
    <Field>
      <Button
        type='button'
        onClick={() => {
          mutate({ token })
        }}
        disabled={isPending}
      >
        Verify Email
      </Button>
    </Field>
  )
}
