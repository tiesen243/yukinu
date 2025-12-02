import { Button } from '@yukinu/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { Textarea } from '@yukinu/ui/textarea'
import { VendorValidators } from '@yukinu/validators/vendor'

import { useTRPCClient } from '@/lib/trpc/react'

export default function AppVendorPage() {
  const trpc = useTRPCClient()

  const form = useForm({
    defaultValues: {
      name: '',
      description: undefined,
      image: undefined,
      address: undefined,
    } as Omit<VendorValidators.CreateInput, 'ownerId'>,
    schema: VendorValidators.createInput.omit({ ownerId: true }),
    onSubmit: trpc.vendor.create.mutate,
    onSuccess: () =>
      toast.success('Vendor application submitted successfully!', {
        description:
          'Thank you for applying. We will review your application and get back to you soon.',
      }),
    onError: ({ message }) =>
      toast.error('Failed to submit vendor application.', {
        description: message,
      }),
  })

  return (
    <form
      onSubmit={form.handleSubmit}
      className='rounded-lg bg-card p-6 text-card-foreground shadow-sm'
    >
      <FieldSet>
        <FieldLegend>Vendor Application</FieldLegend>
        <FieldDescription>
          Please fill out the form below to apply as a vendor on our platform.
        </FieldDescription>

        <FieldGroup>
          <form.Field
            name='name'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={meta.fieldId}>Name</FieldLabel>
                <Input {...field} placeholder='Vendor Name' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='description'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={meta.fieldId}>Description</FieldLabel>
                <Textarea {...field} placeholder='Vendor Description' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='image'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={meta.fieldId}>Image URL</FieldLabel>
                <Input
                  {...field}
                  type='url'
                  placeholder='https://example.com/image.jpg'
                />
                <FieldDescription id={meta.descriptionId}>
                  This will be replaced with an image upload dropzone in the
                  future.
                </FieldDescription>
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='address'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={meta.fieldId}>Address</FieldLabel>
                <Input {...field} placeholder='Vendor Address' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <Field>
            <Button type='submit' disabled={form.state.isPending}>
              {form.state.isPending ? 'Submitting...' : 'Submit Application'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
