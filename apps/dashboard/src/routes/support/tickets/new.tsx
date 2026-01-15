import { useMutation } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
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

  const { formId, FormField, handleSubmit, state } = useForm({
    defaultValues: {
      subject: '',
      description: '',
    },
    schema: createTicketInput.omit({ userId: true }),
    onSubmit: mutateAsync,
    onSuccess: () => navigate('/support/tickets'),
  })

  return (
    <Card id={formId} render={<form onSubmit={handleSubmit} />}>
      <FieldSet className='px-6'>
        <FieldTitle>Create New Support Ticket</FieldTitle>
        <FieldDescription>
          Use the form below to submit a new support ticket. Please provide a
          clear subject and detailed description of your issue or request.
        </FieldDescription>

        <FieldGroup>
          <FormField
            name='subject'
            render={({ field, meta }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Subject</FieldLabel>
                <Input {...field} placeholder="What's the issue about?" />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <FormField
            name='description'
            render={({ field, meta }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Description</FieldLabel>
                <Textarea
                  {...field}
                  placeholder='Please provide a detailed description of your issue or request.'
                />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <Field>
            <Button type='submit' disabled={state.isPending}>
              {state.isPending ? 'Submitting...' : 'Submit Ticket'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </Card>
  )
}
