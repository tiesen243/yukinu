import { useMutation } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router'

import { Button } from '@yukinu/ui/button'
import {
  Field,
  FieldDescription,
  FieldLegend,
  FieldSet,
} from '@yukinu/ui/field'
import { toast } from '@yukinu/ui/sonner'

import { useTRPC } from '@/lib/trpc/react'

export default function InvitePage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  if (!token)
    return (
      <main className='grid min-h-dvh place-items-center'>
        <div className='w-full max-w-xl rounded-xl p-6 text-card-foreground sm:border sm:bg-card sm:shadow-sm'>
          <FieldSet>
            <FieldLegend>Error</FieldLegend>
            <FieldDescription>
              No token provided. Please check the link in your email.
            </FieldDescription>
          </FieldSet>
        </div>
      </main>
    )

  return (
    <main className='grid min-h-dvh place-items-center'>
      <form
        method='POST'
        className='w-full max-w-xl rounded-xl p-6 text-card-foreground sm:border sm:bg-card sm:shadow-sm'
      >
        <FieldSet>
          <FieldLegend>Accept Staff Invitation</FieldLegend>
          <FieldDescription>
            Please click the button below to accept your staff invitation.
          </FieldDescription>

          <AcceptInviteForm token={token} />
        </FieldSet>
      </form>
    </main>
  )
}

const AcceptInviteForm: React.FC<{ token: string }> = ({ token }) => {
  const trpc = useTRPC()
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    ...trpc.vendor.acceptStaffInvitation.mutationOptions(),
    onError: ({ message }) => toast.error(message),
    onSuccess: () => {
      toast.success('Invitation accepted!')
      void navigate('/')
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
        Accept Invitation
      </Button>
    </Field>
  )
}
