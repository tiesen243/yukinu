import type { UserEntity } from '@yukinu/api/identity'

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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@yukinu/ui/field'
import { RadioGroup, RadioGroupItem } from '@yukinu/ui/radio-group'
import { toast } from '@yukinu/ui/toast'
import { useState } from 'react'

import { useTRPC } from '@/lib/trpc'

export const UpdateUserButton: React.FC<{
  userId: string
  username: string
  userRole: UserEntity.Role
  userStatus: UserEntity.Status
}> = ({ userId, username, userRole, userStatus }) => {
  const { trpc } = useTRPC()
  const [isOpen, setIsOpen] = useState(false)
  const [role, setRole] = useState(userRole)
  const [status, setStatus] = useState(userStatus)

  const updateUser = useMutation({
    ...trpc.identity.user.update.mutationOptions(),
    meta: {
      filter: trpc.identity.user.all.queryFilter(),
    },
    onSuccess: () => [
      toast.success({ message: 'User updated successfully' }),
      setIsOpen(false),
    ],
    onError: ({ message }) => toast.error({ message }),
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button />}>Edit</DialogTrigger>

      <DialogContent className='sm:max-w-xl md:grid-cols-2'>
        <DialogHeader className='md:col-span-2'>
          <DialogTitle>Edit User: {username}</DialogTitle>
        </DialogHeader>

        <FieldTitle id={`${userId}-role`}>Role</FieldTitle>
        <FieldTitle
          id={`${userId}-status`}
          className='row-start-4 md:row-start-auto'
        >
          Status
        </FieldTitle>

        <RadioGroup
          value={role}
          onValueChange={setRole}
          aria-describedby={`${userId}-role`}
        >
          {roles.map((_role) => (
            <FieldLabel htmlFor={`${userId}-${_role.value}`} key={_role.value}>
              <Field orientation='horizontal'>
                <FieldContent>
                  <FieldTitle>{_role.label}</FieldTitle>
                  <FieldDescription>{_role.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value={_role.value}
                  id={`${userId}-${_role.value}`}
                />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>

        <RadioGroup
          value={status}
          onValueChange={setStatus}
          aria-describedby={`${userId}-status`}
        >
          {statuses.map((_status) => (
            <FieldLabel
              htmlFor={`${userId}-${_status.value}`}
              key={_status.value}
            >
              <Field orientation='horizontal'>
                <FieldContent>
                  <FieldTitle>{_status.label}</FieldTitle>
                  <FieldDescription>{_status.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value={_status.value}
                  id={`${userId}-${_status.value}`}
                />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>

        <DialogFooter className='md:col-span-2'>
          <DialogClose
            render={
              <Button variant='outline' disabled={updateUser.isPending} />
            }
          >
            Cancel
          </DialogClose>
          <Button
            onClick={() => updateUser.mutate({ id: userId, role, status })}
            disabled={updateUser.isPending}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const roles = [
  {
    value: 'admin',
    label: 'Admin',
    description: 'Full access to all features and settings.',
  },
  {
    value: 'moderator',
    label: 'Moderator',
    description: 'Can manage user content and moderate discussions.',
  },
  {
    value: 'user',
    label: 'User',
    description: 'Standard user with access to basic features.',
  },
]

const statuses = [
  {
    value: 'active',
    label: 'Active',
    description: 'User account is active and can access the system.',
  },
  {
    value: 'inactive',
    label: 'Inactive',
    description: 'User account is inactive and cannot access the system.',
  },
  {
    value: 'banned',
    label: 'Banned',
    description: 'User account is banned due to violations of terms.',
  },
]
