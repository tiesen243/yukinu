import { useMutation } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@yukinu/ui/dialog'
import { Field, FieldLabel } from '@yukinu/ui/field'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/toast'
import { useState } from 'react'

import { useTRPC } from '@/lib/trpc'

export const InviteStaffButton: React.FC = () => {
  const { trpc } = useTRPC()
  const [email, setEmail] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const invite = useMutation({
    ...trpc.merchant.staff.invite.mutationOptions(),
    onSuccess: () => [
      toast.success({ message: 'Invitation sent successfully' }),
      setIsOpen(false),
      setEmail(''),
    ],
    onError: ({ message }) => toast.error({ message }),
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button variant='outline'>Invite Staff</Button>} />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite New Staff</DialogTitle>
        </DialogHeader>

        <Field>
          <FieldLabel htmlFor='email'>Email Address</FieldLabel>
          <Input
            id='email'
            type='email'
            placeholder='Enter staff email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <DialogFooter>
          <DialogClose
            disabled={invite.isPending}
            render={<Button variant='outline' />}
          >
            Cancel
          </DialogClose>
          <Button
            onClick={() => invite.mutate({ email })}
            disabled={invite.isPending || !email}
          >
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
