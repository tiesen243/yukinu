import type { OneProductDto } from '@yukinu/api/catalog'

import { UpdateVariantDto } from '@yukinu/api/catalog'
import { Button } from '@yukinu/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

export const EditVariantButton: React.FC<{
  productId: OneProductDto.Output['id']
  variant: OneProductDto.Output['variants'][number]
}> = ({ productId, variant }) => {
  const { trpcClient, trpc, queryClient } = useTRPC()
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      id: variant.id,
      price: variant.price,
      stock: variant.stock,
    },
    schema: UpdateVariantDto.input,
    onSubmit: trpcClient.catalog.variant.update.mutate,
    onSuccess: () => [
      toast.success({ message: 'Variant updated successfully' }),
      queryClient.invalidateQueries(
        trpc.catalog.product.one.queryFilter({ id: productId }),
      ),
      setIsOpen(false),
    ],
    onError: toast.error,
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button />}>Edit</DialogTrigger>

      <DialogContent
        render={<form id={form.formId} onSubmit={form.handleSubmit} />}
      >
        <DialogHeader>
          <DialogTitle>Edit Variant</DialogTitle>
          <DialogDescription render={<ul />}>
            {variant.options.map((option) => (
              <li key={option.name}>
                {option.name}: {option.value}
              </li>
            ))}
          </DialogDescription>
        </DialogHeader>

        <form.Field
          name='price'
          render={({ field, meta }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={field.id}>Price</FieldLabel>
              <Input
                {...field}
                placeholder='Price'
                disabled={form.state.isPending}
              />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <form.Field
          name='stock'
          render={({ field, meta }) => (
            <Field data-invalid={meta.errors.length > 0}>
              <FieldLabel htmlFor={field.id}>Stock</FieldLabel>
              <Input
                {...field}
                type='number'
                placeholder='Stock'
                disabled={form.state.isPending}
              />
              <FieldError id={meta.errorId} errors={meta.errors} />
            </Field>
          )}
        />

        <DialogFooter>
          <DialogClose
            type='button'
            render={<Button variant='outline' />}
            disabled={form.state.isPending}
          >
            Cancel
          </DialogClose>
          <Button type='submit' disabled={form.state.isPending}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
