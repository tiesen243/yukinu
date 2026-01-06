import { useMutation } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { Textarea } from '@yukinu/ui/textarea'
import { createTicketInput } from '@yukinu/validators/general'
import { useNavigate } from 'react-router'

import { useTRPC } from '@/lib/trpc/react'

export default function NewSupportTicketPage() {
  const trpc = useTRPC()
  const navigate = useNavigate()

  const { mutateAsync } = useMutation({
    ...trpc.ticket.create.mutationOptions(),
    meta: { filter: trpc.ticket.all.queryFilter() },
    onSuccess: () => toast.success('Support ticket created successfully!'),
    onError: ({ message }) =>
      toast.error('Error creating support ticket', { description: message }),
  })

  const form = useForm({
    defaultValues: {
      subject: '',
      description: '',
    },
    schema: createTicketInput.omit({ userId: true }),
    onSubmit: mutateAsync,
    onSuccess: () => navigate('/support/tickets'),
  })

  return (
    <Card render={<form onSubmit={form.handleSubmit} />}>
      <FieldSet className='px-4'>
        <FieldTitle>Create New Support Ticket</FieldTitle>
        <FieldDescription>
          Use the form below to submit a new support ticket. Please provide a
          clear subject and detailed description of your issue or request.
        </FieldDescription>

        <FieldGroup>
          <form.Field
            name='subject'
            render={({ field, meta }) => (
              <Field>
                <FieldLabel htmlFor={meta.fieldId}>Subject</FieldLabel>
                <Input {...field} placeholder="What's the issue about?" />
              </Field>
            )}
          />

          <form.Field
            name='description'
            render={({ field, meta }) => (
              <Field>
                <FieldLabel htmlFor={meta.fieldId}>Description</FieldLabel>
                <Textarea
                  {...field}
                  placeholder='Please provide a detailed description of your issue or request.'
                  onInput={(e) => {
                    const target = e.currentTarget
                    target.style.height = 'auto'
                    target.style.height = `${target.scrollHeight}px`
                  }}
                />
              </Field>
            )}
          />

          <Field>
            <Button type='submit' disabled={form.state.isPending}>
              {form.state.isPending ? 'Submitting...' : 'Submit Ticket'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </Card>
  )
}
