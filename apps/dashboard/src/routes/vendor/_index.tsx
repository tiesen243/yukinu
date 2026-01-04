import type { Route } from './+types/_index'

import { useMutation } from '@tanstack/react-query'
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
import { useTRPC } from '@/lib/trpc/react'
import { createTRPC, getQueryClient } from '@/lib/trpc/rsc'

export const loader = ({ request }: Route.LoaderArgs) => {
  const trpc = createTRPC(request)
  return getQueryClient().ensureQueryData(trpc.vendor.me.queryOptions({}))
}

export default function MyStorePage({ loaderData }: Route.ComponentProps) {
  const trpc = useTRPC()
  const { mutateAsync } = useMutation({
    ...trpc.vendor.update.mutationOptions(),
    meta: { filter: trpc.vendor.me.queryFilter() },
  })

  const form = useForm({
    defaultValues: {
      name: loaderData.name,
      description: loaderData.description,
      image: loaderData.image,
      address: loaderData.address,
      contact: loaderData.contact,
      payoutBankName: loaderData.payoutBankName,
      payoutAccountName: loaderData.payoutAccountName,
      payoutAccountNumber: loaderData.payoutAccountNumber,
    } as Omit<VendorValidators.UpdateVendorInput, 'id'>,
    schema: VendorValidators.updateVendorInput.omit({ id: true }),
    onSubmit: mutateAsync,
    onSuccess: () => toast.success('Store updated successfully!'),
    onError: ({ message }) =>
      toast.error('Failed to update store', { description: message }),
  })

  return (
    <>
      <h1 className='sr-only'>My Store page</h1>
      <Card render={<form onSubmit={form.handleSubmit} />}>
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
                  <FieldLabel htmlFor={meta.fieldId}>Store Name</FieldLabel>
                  <Input {...field} placeholder='Vendor Name' />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name='description'
              render={({ meta, field: { value = '', ...field } }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={meta.fieldId}>Description</FieldLabel>
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
                  <FieldLabel htmlFor={meta.fieldId}>Image URL</FieldLabel>
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
                  <FieldLabel htmlFor={meta.fieldId}>Address</FieldLabel>
                  <Input {...field} value={value ?? ''} />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name='contact'
              render={({ meta, field: { value, ...field } }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={meta.fieldId}>Contact</FieldLabel>
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
                  <FieldLabel htmlFor={meta.fieldId}>Bank Name</FieldLabel>
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
                  <FieldLabel htmlFor={meta.fieldId}>Account Name</FieldLabel>
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
                  <FieldLabel htmlFor={meta.fieldId}>Account Number</FieldLabel>
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
