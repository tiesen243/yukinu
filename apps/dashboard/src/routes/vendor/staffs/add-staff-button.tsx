import { useState } from 'react'
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

import { useTRPC } from '@/lib/trpc/react'

export const AddStaffButton: React.FC = () => {
  const trpc = useTRPC()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')

  const { mutate, isPending } = useMutation({
    ...trpc.vendor.addStaff.mutationOptions(),
    meta: { filter: trpc.vendor.allStaffs.queryFilter() },
    onError: ({ message }) => toast.error(message),
    onSuccess: () => {
      toast.success('Invitation sent successfully!')
      setOpen(false)
      setEmail('')
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Staff</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Staff</DialogTitle>
          <DialogDescription>
            Fill email address of the user you want to add as staff to your
            vendor.
          </DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel htmlFor='email'>Email Address</FieldLabel>
          <Input
            type='email'
            id='email'
            placeholder='yuki@tiesen.id.vn'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
        </Field>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>

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
