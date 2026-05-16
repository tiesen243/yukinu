import { CreateTicketDto } from '@yukinu/api/identity'
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
import { Field, FieldError, FieldLabel } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { Textarea } from '@yukinu/ui/textarea'
import { toast } from '@yukinu/ui/toast'
import { useState } from 'react'

import { useTRPC } from '@/lib/trpc'

export const CreateTicketButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { trpcClient, trpc, queryClient } = useTRPC()

  const form = useForm({
    defaultValues: {
      subject: '',
      description: '',
    },
    schema: CreateTicketDto.input.omit({ userId: true }),
    onSubmit: trpcClient.identity.ticket.create.mutate,
    onSuccess: () => [
      toast.success({ message: 'Ticket created successfully' }),
      queryClient.invalidateQueries(trpc.identity.ticket.me.queryFilter()),
      setIsOpen(false),
    ],
    onError: toast.error,
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button variant='outline' />}>
        Create Ticket
      </DialogTrigger>

      <DialogContent
        render={<form id={form.formId} onSubmit={form.handleSubmit} />}
      >
        <DialogHeader>
          <DialogTitle>Create a new support ticket</DialogTitle>
        </DialogHeader>

        <form.Field
          name='subject'
          render={({ field, meta }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={field.id}>Subject</FieldLabel>
              <Input
                {...field}
                placeholder='Enter the subject of your ticket'
                disabled={form.state.isPending}
              />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <form.Field
          name='description'
          render={({ field, meta }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={field.id}>Description</FieldLabel>
              <Textarea
                {...field}
                placeholder='Provide a detailed description of your issue'
                disabled={form.state.isPending}
              />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <DialogFooter>
          <DialogClose
            type='button'
            disabled={form.state.isPending}
            render={<Button variant='outline' />}
          >
            Cancel
          </DialogClose>
          <Button type='submit' disabled={form.state.isPending}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
