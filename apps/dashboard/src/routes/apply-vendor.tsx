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
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@yukinu/ui/input-group'
import { toast } from '@yukinu/ui/sonner'
import * as VendorValidators from '@yukinu/validators/vendor'

import { InputGroupUploadButton } from '@/components/input-group-upload-button'
import { useTRPCClient } from '@/lib/trpc/react'

export default function AppVendorPage() {
  const trpc = useTRPCClient()

  const { formId, FormField, handleSubmit, state } = useForm({
    defaultValues: {
      name: '',
      description: null,
      image: null,
      address: null,
    } as Omit<VendorValidators.CreateVendorInput, 'ownerId'>,
    schema: VendorValidators.createVendorInput.omit({ ownerId: true }),
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

      <Card id={formId} render={<form onSubmit={handleSubmit} />}>
        <FieldSet className='px-6'>
          <FieldLegend>Vendor Application</FieldLegend>
          <FieldDescription>
            Please fill out the form below to apply as a vendor on our platform.
          </FieldDescription>

          <FieldGroup>
            <FormField
              name='name'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.id}>Name</FieldLabel>
                  <Input {...field} placeholder='Vendor Name' />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <FormField
              name='description'
              render={({ meta, field: { value, ...field } }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.id}>Description</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      value={value ?? ''}
                      aria-invalid={field['aria-invalid']}
                      placeholder='Vendor Description'
                    />
                    <InputGroupAddon align='block-end' className='justify-end'>
                      <InputGroupText>{value?.length ?? 0}/2000</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <FormField
              name='image'
              render={({ meta, field: { value, ...field } }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.id}>Image URL</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      type='url'
                      value={value ?? ''}
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

            <FormField
              name='address'
              render={({ meta, field: { value, ...field } }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.id}>Address</FieldLabel>
                  <Input
                    {...field}
                    value={value ?? ''}
                    placeholder='Vendor Address'
                  />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <Field>
              <Button type='submit' disabled={state.isPending}>
                {state.isPending ? 'Submitting...' : 'Submit Application'}
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </Card>
    </>
  )
}
