import { useMutation } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@yukinu/ui/dialog'
import { Field, FieldLabel } from '@yukinu/ui/field'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { useState } from 'react'

import { useTRPC } from '@/lib/trpc/react'

export const InviteStaffButton: React.FC = () => {
  const trpc = useTRPC()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')

  const { mutate, isPending } = useMutation({
    ...trpc.vendor.inviteStaff.mutationOptions(),
    meta: { filter: trpc.vendor.allStaffs.queryFilter() },
    onSuccess: () => {
      toast.success('Invitation sent successfully!')
      setOpen(false)
      setEmail('')
    },
    onError: ({ message }) =>
      toast.error('Failed to invite staff', { description: message }),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Invite New Staff</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite New Staff</DialogTitle>
          <DialogDescription>
            Enter the email address of the staff member you want to invite.
          </DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel htmlFor='email'>Email Address</FieldLabel>
          <Input
            type='email'
            id='email'
            placeholder='yukikaze@example.com'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
        </Field>

        <DialogFooter>
          <DialogClose disabled={isPending}>Cancel</DialogClose>
          <Button
            onClick={() => {
              mutate({ email })
            }}
            disabled={isPending}
          >
            {isPending ? 'Adding...' : 'Add Staff'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
