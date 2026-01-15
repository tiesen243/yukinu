'use client'

import { useMutation } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { createAddressInput } from '@yukinu/validators/user'
import { useRouter } from 'next/navigation'

import { useTRPC } from '@/lib/trpc/react'

export const NewAddressForm: React.FC = () => {
  const trpc = useTRPC()
  const router = useRouter()

  const { mutateAsync } = useMutation({
    ...trpc.address.create.mutationOptions(),
    meta: { filter: trpc.address.all.queryFilter() },
    onSuccess: () => toast.success('Address added successfully!'),
    onError: ({ message }) =>
      toast.error('Error adding address', { description: message }),
  })

  const { formId, FormField, handleSubmit, state } = useForm({
    defaultValues: {
      recipientName: '',
      phoneNumber: '',
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
    schema: createAddressInput.omit({ userId: true }),
    onSubmit: mutateAsync,
    onSuccess: () => {
      router.push('/account/address')
    },
  })

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <FieldSet>
        <FieldGroup>
          <FormField
            name='recipientName'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Recipient Name</FieldLabel>
                <Input {...field} placeholder='John Doe' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <FormField
            name='phoneNumber'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Phone Number</FieldLabel>
                <Input {...field} placeholder='(+1) 123 456 7890' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <FormField
            name='street'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Street Address</FieldLabel>
                <Input {...field} placeholder='123 Main St' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <FormField
            name='city'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>City</FieldLabel>
                <Input {...field} placeholder='New York' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <FormField
            name='state'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>State/Province</FieldLabel>
                <Input {...field} placeholder='NY' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <FormField
            name='country'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Country</FieldLabel>
                <Input {...field} placeholder='USA' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <FormField
            name='postalCode'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Postal Code</FieldLabel>
                <Input {...field} placeholder='10001' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <Field>
            <Button type='submit' disabled={state.isPending}>
              {state.isPending ? 'Adding...' : 'Add Address'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
