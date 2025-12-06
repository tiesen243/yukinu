'use client'

import { useRouter } from 'next/navigation'
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
import { UserValidators } from '@yukinu/validators/user'

import { useTRPC } from '@/lib/trpc/react'

export const NewAddressForm: React.FC = () => {
  const trpc = useTRPC()
  const router = useRouter()

  const { mutateAsync } = useMutation({
    ...trpc.user.createAddress.mutationOptions(),
    meta: { filter: trpc.user.allAddresses.queryFilter() },
    onSuccess: () => toast.success('Address added successfully!'),
    onError: ({ message }) =>
      toast.error('Error adding address', { description: message }),
  })

  const form = useForm({
    defaultValues: {
      recipientName: '',
      phoneNumber: '',
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
    schema: UserValidators.createAddressInput.omit({ userId: true }),
    onSubmit: mutateAsync,
    onSuccess: () => {
      router.push('/account/address')
    },
  })

  return (
    <FieldSet>
      <FieldGroup>
        <form.Field
          name='recipientName'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={meta.fieldId}>Recipient Name</FieldLabel>
              <Input {...field} placeholder='John Doe' />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <form.Field
          name='phoneNumber'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={meta.fieldId}>Phone Number</FieldLabel>
              <Input {...field} placeholder='(+1) 123 456 7890' />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <form.Field
          name='street'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={meta.fieldId}>Street Address</FieldLabel>
              <Input {...field} placeholder='123 Main St' />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <form.Field
          name='city'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={meta.fieldId}>City</FieldLabel>
              <Input {...field} placeholder='New York' />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <form.Field
          name='state'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={meta.fieldId}>State/Province</FieldLabel>
              <Input {...field} placeholder='NY' />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <form.Field
          name='country'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={meta.fieldId}>Country</FieldLabel>
              <Input {...field} placeholder='USA' />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <form.Field
          name='postalCode'
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={meta.fieldId}>Postal Code</FieldLabel>
              <Input {...field} placeholder='10001' />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <Field>
          <Button
            type='submit'
            onClick={form.handleSubmit}
            disabled={form.state.isPending}
          >
            {form.state.isPending ? 'Adding...' : 'Add Address'}
          </Button>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
