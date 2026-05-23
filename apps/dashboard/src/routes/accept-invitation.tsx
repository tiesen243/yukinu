import { useMutation } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@yukinu/ui/card'
import { toast } from '@yukinu/ui/toast'
import { useNavigate, useSearchParams } from 'react-router'

import { useTurnstile } from '@/components/turnstile.provider'
import { env } from '@/lib/env'
import { createMetadata } from '@/lib/metadata'
import { useTRPC } from '@/lib/trpc'
import { resetTurnstile, verifyTurnstile } from '@/lib/turnstile'

import type { Route } from './+types/accept-invitation'

export const meta: Route.MetaFunction = () =>
  createMetadata({
    title: 'Accept Invitation',
    description:
      'Accept an invitation to join a vendor as a staff member. Click the button to accept the invitation and become part of the vendor team.',
  })

export default function AcceptInvitationPage(_: Route.ComponentProps) {
  const turnstileWidgetId = useTurnstile()
  const [searchParams] = useSearchParams()
  const { trpc } = useTRPC()
  const navigate = useNavigate()

  const accept = useMutation({
    ...trpc.merchant.staff.acceptInvitation.mutationOptions(),
    onSuccess: () => [
      toast.success({ message: 'Invitation accepted successfully!' }),
      navigate('/login'),
    ],
    onError: ({ message }) => {
      resetTurnstile(turnstileWidgetId)
      toast.error({ message })
    },
  })

  const token = searchParams.get('token')
  if (!token)
    return (
      <>
        <CardHeader>
          <CardTitle>Invalid Invitation Token</CardTitle>
          <CardDescription>
            The invitation token is missing or invalid. Please check the link
            you received and try again.
          </CardDescription>
        </CardHeader>
      </>
    )

  return (
    <>
      <CardHeader>
        <CardTitle>Accept Invitation to Join Vendor</CardTitle>
        <CardDescription>
          You have been invited to join a vendor. Please click the button below
          to accept the invitation and become a staff member of the vendor.
        </CardDescription>
      </CardHeader>

      <CardContent
        className='flex-col items-start gap-4'
        render={
          <form
            onSubmit={async (event) => {
              event.preventDefault()
              try {
                await verifyTurnstile(event)
                accept.mutate({ token })
              } catch (error) {
                toast.error({
                  message:
                    error instanceof Error
                      ? error.message
                      : 'Turnstile verification failed',
                })
              }
            }}
          />
        }
      >
        <div
          className='cf-turnstile'
          data-sitekey={env.VITE_TURNSTILE_SITE_KEY}
        />

        <Button type='submit' className='w-full' disabled={accept.isPending}>
          Accept Invitation
        </Button>
      </CardContent>
    </>
  )
}
