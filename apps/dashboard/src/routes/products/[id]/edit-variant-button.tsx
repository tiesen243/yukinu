import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

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
import { Field, FieldError, FieldGroup, FieldLabel } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { ProductValidators } from '@yukinu/validators/product'

import { useTRPC } from '@/lib/trpc/react'

export const EditVariantButton: React.FC<{
  productId: string
  variant: ProductValidators.OneOutput['variants'][number]
}> = ({ productId, variant }) => {
  const [open, setOpen] = useState(false)
  const trpc = useTRPC()
  const { mutateAsync } = useMutation({
    ...trpc.product.updateVariant.mutationOptions(),
    meta: { filter: trpc.product.one.queryFilter({ id: productId }) },
    onSuccess: () => toast.success('Variant updated successfully'),
    onError: ({ message }) =>
      toast.error('Failed to update variant', { description: message }),
  })

  const form = useForm({
    defaultValues: {
      id: variant.id,
      price: variant.price,
      stock: variant.stock,
    },
    schema: ProductValidators.updateVariantInput.omit({ vendorId: true }),
    onSubmit: mutateAsync,
    onSuccess: () => {
      setOpen(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='text-primary underline-offset-4 hover:underline'>
        Edit
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Variant</DialogTitle>
          <DialogDescription>
            Fill in the details to edit variant {variant.sku} (
            {variant.options.map((o) => `${o.name}: ${o.value}`).join(', ')})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit}>
          <FieldGroup>
            <form.Field
              name='price'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={meta.fieldId}>Price</FieldLabel>
                  <Input {...field} placeholder='0.00' />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name='stock'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={meta.fieldId}>Stock</FieldLabel>
                  <Input {...field} type='number' placeholder='0' />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <DialogFooter>
              <DialogClose render={<Button variant='outline' />}>
                Cancel
              </DialogClose>

              <Button disabled={form.state.isPending}>Save Changes</Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
