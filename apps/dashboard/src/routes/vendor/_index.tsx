import type { OneVendorDto } from '@yukinu/api/merchant'

import { useMutation, useQuery } from '@tanstack/react-query'
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

import type { Route } from './+types/_index'

export default function MyStorePage(_: Route.ComponentProps) {
  const { trpc } = useTRPC()
  const { data, isLoading } = useQuery(trpc.merchant.vendor.me.queryOptions())

  if (isLoading || !data)
    return (
      <Card>
        <p>Loading...</p>
      </Card>
    )

  return <MyStoreContent data={data} />
}

const MyStoreContent: React.FC<{ data: OneVendorDto.Output }> = ({ data }) => {
  const { trpc } = useTRPC()
  const { mutateAsync } = useMutation({
    ...trpc.merchant.vendor.update.mutationOptions(),
    meta: { filter: trpc.merchant.vendor.me.queryFilter() },
  })

  const form = useForm({
    defaultValues: {
      name: data.name,
      description: data.description ?? '',
      image: data.image ?? '',
      address: data.address ?? '',
      contact: data.contact ?? '',
      payoutBankName: data.payoutBankName ?? '',
      payoutAccountName: data.payoutAccountName ?? '',
      payoutAccountNumber: data.payoutAccountNumber ?? '',
    },
    schema: SaveVendorDto.input.omit({ id: true }),
    onSubmit: mutateAsync,
    onSuccess: () =>
      toast.add({
        type: 'success',
        title: 'Store updated successfully!',
      }),
    onError: ({ message }) =>
      toast.add({
        type: 'error',
        title: 'Failed to update store.',
        description: message,
      }),
  })

  return (
    <>
      <h1 className='sr-only'>My Store page</h1>
      <Card id={form.formId} render={<form onSubmit={form.handleSubmit} />}>
        <FieldSet className='px-4'>
          <FieldLegend>My Store</FieldLegend>
          <FieldDescription>
            Update your store details and preferences below.
          </FieldDescription>

          <FieldGroup>
            <form.Field
              name='name'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.id}>Store Name</FieldLabel>
                  <Input {...field} placeholder='Vendor Name' />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name='description'
              render={({ meta, field: { value = '', ...field } }) => (
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
                  <Input {...field} value={value ?? ''} />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name='contact'
              render={({ meta, field: { value, ...field } }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.id}>Contact</FieldLabel>
                  <Input
                    {...field}
                    value={value ?? ''}
                    placeholder='Contact Info'
                  />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name='payoutBankName'
              render={({ meta, field: { value, ...field } }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.id}>Bank Name</FieldLabel>
                  <Input
                    {...field}
                    value={value ?? ''}
                    placeholder='Bank Name'
                  />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name='payoutAccountName'
              render={({ meta, field: { value, ...field } }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.id}>Account Name</FieldLabel>
                  <Input
                    {...field}
                    value={value ?? ''}
                    placeholder='Account Name'
                  />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name='payoutAccountNumber'
              render={({ meta, field: { value, ...field } }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.id}>Account Number</FieldLabel>
                  <Input
                    {...field}
                    value={value ?? ''}
                    placeholder='Account Number'
                  />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <Field>
              <Button type='submit' disabled={form.state.isPending}>
                {form.state.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </Card>
    </>
  )
}
