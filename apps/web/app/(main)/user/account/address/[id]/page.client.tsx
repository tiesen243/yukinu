'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

import { Button } from '@yukinu/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { AddressModels } from '@yukinu/validators/address'

import { useTRPC } from '@/trpc/react'

export const EditAddressForm: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter()
  const trpc = useTRPC()

  const { data, refetch } = useSuspenseQuery(
    trpc.address.one.queryOptions({ id }),
  )

  const { mutateAsync } = useMutation({
    ...trpc.address.update.mutationOptions(),
    meta: { filter: trpc.address.all.queryFilter() },
    onSuccess: () => refetch(),
  })

  const form = useForm({
    defaultValues: data,
    schema: AddressModels.updateInput,
    onSubmit: mutateAsync,
    onSuccess: () => {
      router.push('/user/account/address')
      toast.success('Address updated successfully')
    },
    onError: ({ message }) => toast.error(message),
  })

  return (
    <FieldGroup className='px-4'>
      {fields.map(({ name, label, placeholder }) => (
        <form.Field
          key={name}
          name={name}
          render={({ meta, field }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={meta.fieldId}>{label}</FieldLabel>
              <Input {...field} placeholder={placeholder} />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />
      ))}

      <Field>
        <Button
          type='submit'
          onClick={form.handleSubmit}
          disabled={form.state.isPending}
        >
          Save Address
        </Button>
      </Field>
    </FieldGroup>
  )
}

const fields = [
  { name: 'recipientName', label: 'Recipient Name', placeholder: 'Yukikaze' },
  {
    name: 'phoneNumber',
    label: 'Phone Number',
    placeholder: '(+1) 234-567-8900',
  },
  { name: 'street', label: 'Street Address', placeholder: '123 Main St' },
  { name: 'city', label: 'City', placeholder: 'Springfield' },
  { name: 'state', label: 'State/Province', placeholder: 'IL' },
  { name: 'postalCode', label: 'Postal Code', placeholder: '62701' },
  { name: 'country', label: 'Country', placeholder: 'USA' },
] as const
