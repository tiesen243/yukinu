import type { OneVendorDto } from '@yukinu/api/merchant'

import { SaveVendorDto } from '@yukinu/api/merchant'
import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { Textarea } from '@yukinu/ui/textarea'
import { toast } from '@yukinu/ui/toast'

import { UploadInput } from '@/components/upload-input'
import { useTRPC } from '@/lib/trpc'

export const UpdateVendorForm: React.FC<{
  vendor: OneVendorDto.Output
}> = ({ vendor }) => {
  const { trpcClient, trpc, queryClient } = useTRPC()

  const form = useForm({
    defaultValues: {
      ...vendor,
      description: vendor.description ?? '',
      image: vendor.image ?? '',
      address: vendor.address ?? '',
      contact: vendor.contact ?? '',
      payoutBankName: vendor.payoutBankName ?? '',
      payoutAccountName: vendor.payoutAccountName ?? '',
      payoutAccountNumber: vendor.payoutAccountNumber ?? '',
    },
    schema: SaveVendorDto.input,
    onSubmit: trpcClient.merchant.vendor.update.mutate,
    onSuccess: () => [
      queryClient.invalidateQueries(trpc.merchant.vendor.me.queryFilter()),
      toast.success({ message: 'Store updated successfully' }),
    ],
    onError: toast.error,
  })

  return (
    <Card
      className='my-4'
      render={<form id={form.formId} onSubmit={form.handleSubmit} />}
    >
      <FieldSet className='px-4' disabled={form.state.isPending}>
        <FieldGroup>
          {fields.map((_field) => (
            <form.Field
              key={_field.name}
              name={_field.name}
              render={({ field, meta }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.id}>{_field.label}</FieldLabel>
                  {_field.type === 'textarea' && (
                    <Textarea {..._field} {...field} />
                  )}
                  {_field.type === 'file' && (
                    <UploadInput
                      endpoint='avatarUploader'
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  )}
                  {_field.type !== 'textarea' && _field.type !== 'file' && (
                    <Input {..._field} {...field} />
                  )}
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />
          ))}

          <Field>
            <Button type='submit'>Save Changes</Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </Card>
  )
}

const fields = [
  {
    name: 'name',
    label: 'Store Name',
    type: 'text',
    placeholder: 'Enter your store name',
  },
  {
    name: 'description',
    label: 'Store Description',
    type: 'textarea',
    placeholder: 'Enter a description for your store',
  },
  {
    name: 'contact',
    label: 'Contact Information',
    type: 'text',
    placeholder: 'Enter your contact information (e.g., email, phone)',
  },
  {
    name: 'address',
    label: 'Store Address',
    type: 'text',
    placeholder: 'Enter your store address',
  },
  {
    name: 'image',
    label: 'Store Image',
    type: 'file',
    placeholder: 'Upload an image for your store',
  },
  {
    name: 'payoutBankName',
    label: 'Bank Name',
    type: 'text',
    placeholder: 'Enter the name of your payout bank',
  },
  {
    name: 'payoutAccountNumber',
    label: 'Account Number',
    type: 'text',
    placeholder: 'Enter your payout bank account number',
  },
  {
    name: 'payoutAccountName',
    label: 'Account Name',
    type: 'text',
    placeholder: 'Enter the name on your payout bank account',
  },
] as const
