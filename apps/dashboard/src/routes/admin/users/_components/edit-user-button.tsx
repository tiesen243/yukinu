import type { AllUsersOutput } from '@yukinu/validators/user'

import { useMutation } from '@tanstack/react-query'
import { cn } from '@yukinu/ui'
import { Button } from '@yukinu/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@yukinu/ui/dialog'
import { FieldGroup, Field, FieldLabel } from '@yukinu/ui/field'
import { Label } from '@yukinu/ui/label'
import { NativeSelect, NativeSelectOption } from '@yukinu/ui/native-select'
import { RadioGroup, RadioGroupItem } from '@yukinu/ui/radio-group'
import { toast } from '@yukinu/ui/sonner'
import { roles, userStatuses } from '@yukinu/validators/auth'
import { useState } from 'react'

import { useTRPC } from '@/lib/trpc/react'

export const EditUserButton: React.FC<{
  user: AllUsersOutput['users'][number]
}> = ({ user }) => {
  const trpc = useTRPC()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(user.status)
  const [role, setRole] = useState(user.role)

  const { mutate, isPending } = useMutation({
    ...trpc.user.update.mutationOptions(),
    onSuccess: () => {
      toast.success('User updated successfully')
      setOpen(false)
    },
    onError: ({ message }) =>
      toast.error('Failed to update user', { description: message }),
    meta: { filter: trpc.user.all.queryFilter() },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger variant='link'>Edit</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Modify the role and status of the user.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor='role'>Role</FieldLabel>
            <NativeSelect
              id='role'
              value={role}
              onChange={(e) => {
                setRole(e.target.value)
              }}
            >
              {roles.map((role) => (
                <NativeSelectOption key={role} label={role} value={role} />
              ))}
            </NativeSelect>
          </Field>

          <Field>
            <FieldLabel>Status</FieldLabel>
            <RadioGroup value={status} onValueChange={setStatus as never}>
              {userStatuses.map((status) => (
                <Label
                  key={status}
                  htmlFor={status}
                  className={cn(
                    'flex cursor-pointer items-center space-x-2 rounded-md border border-current/40 bg-current/5 px-2 py-4 capitalize transition-colors hover:bg-current/10',
                    {
                      'text-success': status === 'active',
                      'text-destructive': status === 'inactive',
                    },
                  )}
                >
                  <RadioGroupItem id={status} value={status} /> {status}
                </Label>
              ))}
            </RadioGroup>
          </Field>
        </FieldGroup>

        <DialogFooter>
          <DialogClose disabled={isPending}>Cancel</DialogClose>
          <Button
            onClick={() => {
              mutate({ id: user.id, status, role })
            }}
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
