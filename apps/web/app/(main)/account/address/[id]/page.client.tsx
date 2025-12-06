'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

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

export const EditAddressForm: React.FC<{ id: string }> = ({ id }) => {
  const trpc = useTRPC()
  const router = useRouter()

  const { data, refetch } = useSuspenseQuery(
    trpc.user.oneAddress.queryOptions({ id }),
  )

  const { mutateAsync } = useMutation({
    ...trpc.user.updateAddress.mutationOptions(),
    meta: { filter: trpc.user.allAddresses.queryFilter() },
    onSuccess: () => toast.success('Address updated successfully!'),
    onError: ({ message }) =>
      toast.error('Error updating address', { description: message }),
  })

  const form = useForm({
    defaultValues: data,
    schema: UserValidators.updateAddressInput,
    onSubmit: mutateAsync,
    onSuccess: () => {
      router.push('/account/address')
      void refetch()
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
            {form.state.isPending ? 'Saving...' : 'Save Address'}
          </Button>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
