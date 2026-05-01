import type { OneVoucherDto } from '@yukinu/api/sales'

import { useMutation, useQuery } from '@tanstack/react-query'
import { SaveVoucherDto } from '@yukinu/api/sales'
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
import { useNavigate } from 'react-router'

import { useTRPC } from '@/lib/trpc/react'

import type { Route } from './+types/[id]'

export default function VouchersEditPage({ params }: Route.ComponentProps) {
  const { trpc } = useTRPC()

  const { data, isLoading } = useQuery({
    ...trpc.sales.voucher.one.queryOptions({ code: params.id }),
  })

  if (isLoading || !data)
    return (
      <Card>
        <FieldSet className='px-4'>
          <FieldLegend>Loading Voucher...</FieldLegend>
          <FieldDescription>
            Please wait while we load the voucher details.
          </FieldDescription>
        </FieldSet>
      </Card>
    )

  return <VouchersEditForm voucher={data} />
}

const VouchersEditForm: React.FC<{ voucher: OneVoucherDto.Output }> = ({
  voucher,
}) => {
  const { trpc } = useTRPC()
  const navigate = useNavigate()

  const { mutateAsync } = useMutation({
    ...trpc.sales.voucher.save.mutationOptions(),
    meta: { filter: trpc.sales.voucher.all.queryFilter() },
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
    defaultValues: voucher,
    schema: SaveVoucherDto.input,
    onSubmit: mutateAsync,
    onSuccess: () => navigate('/admin/vouchers'),
  })

  return (
    <Card id={form.formId} render={<form onSubmit={form.handleSubmit} />}>
      <FieldSet className='px-4'>
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
            name='expiredAt'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Expiry Date</FieldLabel>
                <Input
                  {...field}
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split('T')[0]
                      : ''
                  }
                  type='date'
                  placeholder='Expiry Date'
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
  )
}
