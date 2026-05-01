import { SaveVendorDto } from '@yukinu/api/merchant'
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
import { toast } from '@yukinu/ui/toast'

import { InputGroupUploadButton } from '@/components/input-group-upload-button'
import { useTRPC } from '@/lib/trpc/react'

export default function AppVendorPage() {
  const { trpcClient } = useTRPC()

  const form = useForm({
    defaultValues: { name: '', description: '', image: '', address: '' },
    schema: SaveVendorDto.input.omit({ ownerId: true }),
    onSubmit: trpcClient.merchant.vendor.create.mutate,
    onSuccess: () =>
      toast.add({
        type: 'success',
        title: 'Vendor application submitted successfully!',
        description:
          'Thank you for applying. We will review your application and get back to you soon.',
      }),
    onError: ({ message }) =>
      toast.add({
        type: 'error',
        title: 'Failed to submit vendor application.',
        description: message,
      }),
  })

  return (
    <>
      <h1 className='sr-only'>Apply as Vendor page</h1>

      <Card id={form.formId} render={<form onSubmit={form.handleSubmit} />}>
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
                  <FieldLabel htmlFor={field.id}>Name</FieldLabel>
                  <Input {...field} placeholder='Vendor Name' />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <form.Field
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

            <form.Field
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

            <form.Field
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
