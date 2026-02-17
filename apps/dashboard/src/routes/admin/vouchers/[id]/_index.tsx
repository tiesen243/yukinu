import { useMutation, useQuery } from '@tanstack/react-query'
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
import { toast } from '@yukinu/ui/toast'
import { updateVoucherInput } from '@yukinu/validators/general'
import { useNavigate } from 'react-router'

import { useTRPC } from '@/lib/trpc/react'
import { createTRPC, getQueryClient } from '@/lib/trpc/rsc'

import type { Route } from './+types/_index'

export const loader = ({ request, params }: Route.LoaderArgs) => {
  const trpc = createTRPC(request)
  return getQueryClient().ensureQueryData(
    trpc.voucher.one.queryOptions({
      id: params.id,
      isUsage: false,
    }),
  )
}

export default function VouchersEditPage({ loaderData }: Route.ComponentProps) {
  const trpc = useTRPC()
  const navigate = useNavigate()

  const {
    data: { expiryDate, ...voucher },
    refetch,
  } = useQuery({
    ...trpc.voucher.one.queryOptions({ id: loaderData.id, isUsage: false }),
    initialData: loaderData,
  })

  const { mutateAsync } = useMutation({
    ...trpc.voucher.update.mutationOptions(),
    meta: { filter: trpc.voucher.all.queryFilter() },
    onSuccess: () =>
      toast.add({
        type: 'success',
        title: 'Voucher updated successfully',
      }),
    onError: ({ message }) =>
      toast.add({
        type: 'error',
        title: 'Failed to update voucher',
        description: message,
      }),
  })

  const form = useForm({
    defaultValues: {
      ...voucher,
      expiryDate: expiryDate.toISOString().split('T')[0] ?? '',
    },
    schema: updateVoucherInput,
    onSubmit: mutateAsync,
    onSuccess: () => {
      void refetch()
      void navigate('/admin/vouchers')
    },
  })

  return (
    <Card id={form.formId} render={<form onSubmit={form.handleSubmit} />}>
      <FieldSet className='px-6'>
        <FieldLegend>Edit Voucher</FieldLegend>
        <FieldDescription>
          Use the form below to edit the Voucher in the system.
        </FieldDescription>

        <FieldGroup>
          <form.Field
            name='code'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Code</FieldLabel>
                <Input {...field} placeholder='Voucher Code' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='discountAmount'
            render={({ meta, field: { value, ...field } }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Discount Amount</FieldLabel>
                <Input
                  {...field}
                  placeholder='Discount Amount'
                  value={value ?? ''}
                />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='discountPercentage'
            render={({ meta, field: { value, ...field } }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Discount Percentage</FieldLabel>
                <Input
                  {...field}
                  type='number'
                  placeholder='Discount Percentage'
                  value={value ?? ''}
                />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='quantity'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Quantity</FieldLabel>
                <Input {...field} type='number' placeholder='Quantity' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='expiryDate'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Expiry Date</FieldLabel>
                <Input {...field} type='date' placeholder='Expiry Date' />
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
  )
}
