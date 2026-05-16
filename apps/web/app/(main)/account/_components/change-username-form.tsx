'use client'

import { useMutation } from '@tanstack/react-query'
import { ChangeUsernameDto } from '@yukinu/api/identity'
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
import {
  FieldSet,
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { PencilIcon } from '@yukinu/ui/icons'
import { Input } from '@yukinu/ui/input'
import { InputGroupButton } from '@yukinu/ui/input-group'
import { toast } from '@yukinu/ui/toast'
import { useState } from 'react'

import { useTRPC } from '@/lib/trpc'

export const ChangeUsernameForm: React.FC<{ username: string }> = ({
  username,
}) => {
  const [open, setOpen] = useState(false)

  const { trpc } = useTRPC()
  const { mutateAsync } = useMutation({
    ...trpc.identity.security.changeUsername.mutationOptions(),
    meta: { filter: trpc.identity.user.profile.queryFilter() },
    onSuccess: () =>
      toast.success({ message: 'Username changed successfully' }),
    onError: ({ message }) => toast.error({ message }),
  })

  const form = useForm({
    defaultValues: { username, password: '' },
    schema: ChangeUsernameDto.input.omit({ id: true }),
    onSubmit: mutateAsync,
    onSuccess: () => setOpen(false),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<InputGroupButton />}>
        <PencilIcon />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Username</DialogTitle>
          <DialogDescription>
            Enter your new username and password to confirm the change.
          </DialogDescription>
        </DialogHeader>

        <form id={form.formId} onSubmit={form.handleSubmit}>
          <FieldSet>
            <FieldGroup>
              <form.Field
                name='username'
                render={({ meta, field }) => (
                  <Field data-invalid={meta.errors.length > 0}>
                    <FieldLabel htmlFor={field.id}>New Username</FieldLabel>
                    <Input {...field} />
                    <FieldError id={meta.errorId} errors={meta.errors} />
                  </Field>
                )}
              />

              <form.Field
                name='password'
                render={({ meta, field }) => (
                  <Field data-invalid={meta.errors.length > 0}>
                    <FieldLabel htmlFor={field.id}>Password</FieldLabel>
                    <Input type='password' {...field} />
                    <FieldError id={meta.errorId} errors={meta.errors} />
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
        </form>

        <DialogFooter>
          <DialogClose
            render={
              <Button variant='outline' disabled={form.state.isPending}>
                Cancel
              </Button>
            }
          />

          <Button
            type='submit'
            form={form.formId}
            disabled={form.state.isPending}
          >
            {form.state.isPending ? 'Changing...' : 'Change Username'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
