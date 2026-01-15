import { useMutation } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
import {
  Field,
  FieldDescription,
  FieldLegend,
  FieldSet,
} from '@yukinu/ui/field'
import { toast } from '@yukinu/ui/sonner'
import { useNavigate, useSearchParams } from 'react-router'

import { useTRPC } from '@/lib/trpc/react'

export default function InvitePage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const trpc = useTRPC()
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    ...trpc.vendorStaff.acceptInvitation.mutationOptions(),
    onError: ({ message }) =>
      toast.error('Failed to accept invitation', { description: message }),
    onSuccess: () => {
      toast.success('Invitation accepted!')
      void navigate('/')
    },
  })

  if (!token)
    return (
      <main className='grid min-h-dvh place-items-center'>
        <h1 className='sr-only'>Accept Staff Invitation page</h1>

        <Card className='w-full max-w-xl bg-background shadow-none ring-0 sm:bg-card sm:shadow-sm sm:ring-1'>
          <FieldSet className='px-6'>
            <FieldLegend>Error</FieldLegend>
            <FieldDescription>
              No token provided. Please check the link in your email.
            </FieldDescription>
          </FieldSet>
        </Card>
      </main>
    )

  return (
    <main className='grid min-h-dvh place-items-center'>
      <h1 className='sr-only'>Accept Staff Invitation page</h1>

      <Card
        className='w-full max-w-xl bg-background shadow-none ring-0 sm:bg-card sm:shadow-sm sm:ring-1'
        render={
          <form
            onSubmit={(e) => {
              e.preventDefault()
              mutate({ token })
            }}
          />
        }
      >
        <FieldSet className='px-6'>
          <FieldLegend>Accept Staff Invitation</FieldLegend>
          <FieldDescription>
            Please click the button below to accept your staff invitation.
          </FieldDescription>

          <Field>
            <Button type='button' disabled={isPending}>
              Accept Invitation
            </Button>
          </Field>
        </FieldSet>
      </Card>
    </main>
  )
}
