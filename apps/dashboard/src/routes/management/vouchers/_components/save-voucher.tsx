import type { VoucherEntity } from '@yukinu/api/sales'

import { useQueryClient } from '@tanstack/react-query'
import { SaveVoucherDto } from '@yukinu/api/sales'
import { Button } from '@yukinu/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@yukinu/ui/dialog'
import { Field, FieldError, FieldLabel } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/toast'
import { useState } from 'react'

import { useTRPC } from '@/lib/trpc'

export const SaveVoucher: React.FC<{
  trigger: React.ReactElement
  voucher?: VoucherEntity
}> = ({ trigger, voucher }) => {
  const { trpcClient, trpc } = useTRPC()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      ...(voucher?.id && { id: voucher.id }),
      code: voucher?.code ?? '',
      discountAmount: voucher?.discountAmount ?? null,
      discountPercentage: voucher?.discountPercentage ?? null,
      quantity: voucher?.quantity ?? 1,
      expiredAt: voucher?.expiredAt ?? new Date(),
    },
    schema: SaveVoucherDto.input,
    onSubmit: trpcClient.sales.voucher.save.mutate,
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.sales.voucher.all.queryFilter())
      toast.success({
        message: `Voucher ${voucher ? 'updated' : 'created'} successfully`,
      })
      setIsOpen(false)
    },
    onError: toast.error,
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {voucher ? 'Edit Voucher' : 'Add new voucher'}
          </DialogTitle>
        </DialogHeader>

        {fields.map((_field) => (
          <form.Field
            key={_field.name}
            name={_field.name}
            render={({ field, meta }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>{_field.label}</FieldLabel>
                <Input
                  {...field}
                  {..._field}
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().slice(0, 16)
                      : (field.value ?? '')
                  }
                />
                <FieldError errors={meta.errors} />
              </Field>
            )}
          />
        ))}

        <Field>
          <Button
            onClick={() => form.handleSubmit()}
            disabled={form.state.isPending}
          >
            {voucher ? 'Save changes' : 'Create voucher'}
          </Button>
        </Field>
      </DialogContent>
    </Dialog>
  )
}

const fields = [
  {
    name: 'code',
    label: 'Code',
    placeholder: 'Enter voucher code',
    type: 'text',
  },
  {
    name: 'discountAmount',
    label: 'Discount Amount',
    placeholder: 'Enter discount amount',
    type: 'text',
  },
  {
    name: 'discountPercentage',
    label: 'Discount Percentage',
    placeholder: 'Enter discount percentage',
    type: 'number',
    min: 0,
    max: 100,
  },
  {
    name: 'quantity',
    label: 'Quantity',
    placeholder: 'Enter quantity',
    type: 'number',
  },
  {
    name: 'expiredAt',
    label: 'Expired At',
    placeholder: 'Select expiration date',
    type: 'datetime-local',
  },
] as const
