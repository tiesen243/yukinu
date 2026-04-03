'use client'

import { useMutation } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import { Field } from '@yukinu/ui/field'
import { toast } from '@yukinu/ui/toast'
import { env } from '@yukinu/validators/env.next'
import { useRouter } from 'next/navigation'

import { useTRPC } from '@/lib/trpc/react'
import { verifyTurnstile } from '@/lib/verify-turnstile.client'

export const VerifyEmailForm: React.FC<{ token: string }> = ({ token }) => {
  const trpc = useTRPC()
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    ...trpc.auth.verifyEmail.mutationOptions(),
    onSuccess: () => {
      toast.add({
        type: 'success',
        title: 'Email verified successfully!',
        description: 'You can now log in to your account.',
      })
      router.push('/login')
    },
    onError: ({ message }) =>
      toast.add({
        type: 'error',
        title: 'Email verification failed',
        description: message,
      }),
  })

  return (
    <form
      className='px-4'
      onSubmit={async (e) => {
        e.preventDefault()

        try {
          await verifyTurnstile(e as never)
          mutate({ token })
        } catch (error) {
          toast.add({
            type: 'error',
            title:
              error instanceof Error
                ? error.message
                : 'An unknown error occurred',
          })
        }
      }}
    >
      <Field>
        <div
          className='cf-turnstile'
          data-sitekey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        />

        <Button type='submit' disabled={isPending}>
          Verify Email
        </Button>
      </Field>
    </form>
  )
}
