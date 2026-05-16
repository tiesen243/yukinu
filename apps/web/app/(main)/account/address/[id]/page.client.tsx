'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { SaveAddressDto } from '@yukinu/api/identity'
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
import { toast } from '@yukinu/ui/toast'
import { useRouter } from 'next/navigation'

import { useTRPC } from '@/lib/trpc'

export const EditAddressForm: React.FC<{ id: string }> = ({ id }) => {
  const { trpcClient, trpc, queryClient } = useTRPC()
  const router = useRouter()

  const { data, refetch } = useSuspenseQuery(
    trpc.identity.address.one.queryOptions({ id }),
  )

  const form = useForm({
    defaultValues: data,
    schema: SaveAddressDto.input,
    onSubmit: trpcClient.identity.address.update.mutate,
    onError: toast.error,
    onSuccess: async () => {
      await queryClient.invalidateQueries(
        trpc.identity.address.all.queryFilter(),
      )
      await refetch()

      toast.success({ message: 'Address updated successfully!' })
      router.push('/account/address')
    },
  })

  return (
    <form id={form.formId} onSubmit={form.handleSubmit}>
      <FieldSet>
        <FieldGroup>
          <form.Field
            name='recipientName'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Recipient Name</FieldLabel>
                <Input {...field} placeholder='John Doe' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='phoneNumber'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Phone Number</FieldLabel>
                <Input {...field} placeholder='(+1) 123 456 7890' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='street'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Street Address</FieldLabel>
                <Input {...field} placeholder='123 Main St' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='city'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>City</FieldLabel>
                <Input {...field} placeholder='New York' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='state'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>State/Province</FieldLabel>
                <Input {...field} placeholder='NY' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='country'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Country</FieldLabel>
                <Input {...field} placeholder='USA' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
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
            <Button type='submit' disabled={form.state.isPending}>
              {form.state.isPending ? 'Saving...' : 'Save Address'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
