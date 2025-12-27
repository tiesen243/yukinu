import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@yukinu/ui/input-group'
import { toast } from '@yukinu/ui/sonner'
import { VendorValidators } from '@yukinu/validators/vendor'

import { InputGroupUploadButton } from '@/components/input-group-upload-button'
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
    <>
      <h1 className='sr-only'>Apply as Vendor page</h1>

      <Card render={<form onSubmit={form.handleSubmit} />}>
        <FieldSet className='px-4'>
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
              render={({ meta, field: { value = '', ...field } }) => (
                <Field
                  data-invalid={meta.errors.length > 0 || value.length > 2000}
                >
                  <FieldLabel htmlFor={meta.fieldId}>Description</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      value={value}
                      aria-invalid={
                        field['aria-invalid'] || value.length > 2000
                      }
                      placeholder='Vendor Description'
                    />
                    <InputGroupAddon align='block-end' className='justify-end'>
                      <InputGroupText>{value.length ?? 0}/2000</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name='image'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={meta.fieldId}>Image URL</FieldLabel>
                  <InputGroup>
                    <Input
                      {...field}
                      type='url'
                      placeholder='https://example.com/image.jpg'
                    />
                    <InputGroupAddon align='inline-end'>
                      <InputGroupUploadButton
                        endpoint='avatarUploader'
                        onUploadComplete={(url) => field.onChange(url)}
                      />
                    </InputGroupAddon>
                  </InputGroup>
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
      </Card>
    </>
  )
}
