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
import * as ProductValidators from '@yukinu/validators/product'
import { useState } from 'react'

import { useTRPC } from '@/lib/trpc/react'

export const EditVariantButton: React.FC<{
  productId: string
  variant: ProductValidators.OneOutput['variants'][number]
}> = ({ productId, variant }) => {
  const [open, setOpen] = useState(false)
  const trpc = useTRPC()
  const { mutateAsync } = useMutation({
    ...trpc.productVariant.update.mutationOptions(),
    meta: { filter: trpc.product.one.queryFilter({ id: productId }) },
    onSuccess: () => toast.success('Variant updated successfully'),
    onError: ({ message }) =>
      toast.error('Failed to update variant', { description: message }),
  })

  const { formId, FormField, handleSubmit, state } = useForm({
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
      <DialogTrigger variant='link'>Edit</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Variant</DialogTitle>
          <DialogDescription>
            Fill in the details to edit variant {variant.sku} (
            {variant.options.map((o) => `${o.name}: ${o.value}`).join(', ')})
          </DialogDescription>
        </DialogHeader>

        <form id={formId} onSubmit={handleSubmit}>
          <FieldGroup>
            <FormField
              name='price'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.id}>Price</FieldLabel>
                  <Input {...field} placeholder='0.00' />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <FormField
              name='stock'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.id}>Stock</FieldLabel>
                  <Input {...field} type='number' placeholder='0' />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <DialogFooter>
              <DialogClose type='button' disabled={state.isPending}>
                Cancel
              </DialogClose>
              <Button type='submit' disabled={state.isPending}>
                Save Changes
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
