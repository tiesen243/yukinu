'use client'

import { useMutation } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import { Field } from '@yukinu/ui/field'
import { toast } from '@yukinu/ui/toast'
import { useRouter } from 'next/navigation'

import { env } from '@/lib/env'
import { useTRPC } from '@/lib/trpc'
import { verifyTurnstile } from '@/lib/verify-turnstile'

export const VerifyEmailForm: React.FC<{ token: string }> = ({ token }) => {
  const { trpc } = useTRPC()
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    ...trpc.identity.auth.verifyEmail.mutationOptions(),
    onSuccess: () => [
      toast.success({ message: 'Email verified successfully!' }),
      router.push('/login'),
    ],
    onError: ({ message }) => toast.error({ message }),
  })

  return (
    <form
      className='px-4'
      onSubmit={async (e) => {
        e.preventDefault()

        try {
          await verifyTurnstile(new FormData(e.currentTarget))
          mutate({ token })
        } catch (error) {
          toast.error({
            message:
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
