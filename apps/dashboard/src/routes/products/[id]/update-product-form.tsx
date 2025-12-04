import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { Button } from '@yukinu/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { MinusIcon } from '@yukinu/ui/icons'
import { Input } from '@yukinu/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@yukinu/ui/input-group'
import { Select, SelectOption } from '@yukinu/ui/select'
import { toast } from '@yukinu/ui/sonner'
import { Textarea } from '@yukinu/ui/textarea'
import { ProductValidators } from '@yukinu/validators/product'

import { useTRPC } from '@/lib/trpc/react'

export const UpdateProductForm: React.FC<{
  data: ProductValidators.OneOutput
}> = ({ data }) => {
  const trpc = useTRPC()
  const navigate = useNavigate()

  const { data: product, refetch } = useQuery({
    ...trpc.product.one.queryOptions({ id: data.id }),
    initialData: data,
  })
  const { data: _data } = useQuery(
    trpc.category.all.queryOptions({ limit: 100 }),
  )
  const { mutateAsync } = useMutation({
    ...trpc.product.update.mutationOptions(),
    meta: { filter: trpc.product.all.queryFilter() },
    onSuccess: () => {
      toast.success('Product updated successfully!')
      void refetch()
    },
    onError: ({ message }) =>
      toast.error('Failed to update product', { description: message }),
  })

  const form = useForm({
    defaultValues: {
      id: product.id,
      name: product.name,
      description: product.description ?? undefined,
      categoryId: product.category?.id ?? undefined,
      price: product.price,
      stock: product.stock,
      images: product.images.map((img) => img.url),
      attributes: product.attributes,
    } as Omit<ProductValidators.UpdateInput, 'vendorId'>,
    schema: ProductValidators.updateInput.omit({ vendorId: true }),
    onSubmit: mutateAsync,
    onSuccess: () => void navigate('/products'),
  })

  return (
    <form
      onSubmit={form.handleSubmit}
      className='rounded-lg bg-card p-6 text-card-foreground shadow-sm'
    >
      <FieldSet>
        <FieldLegend>Update Product</FieldLegend>
        <FieldDescription>
          Modify the details of your product below.
        </FieldDescription>

        <FieldGroup>
          <FieldGroup>
            <form.Field
              name='name'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={meta.fieldId}>Name</FieldLabel>
                  <Input
                    {...field}
                    placeholder='What is the name of the product?'
                  />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name='description'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={meta.fieldId}>Description</FieldLabel>
                  <Textarea
                    {...field}
                    placeholder='Write a brief description about the product'
                  />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name='categoryId'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={meta.fieldId}>Category</FieldLabel>
                  <Select
                    id={meta.fieldId}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <SelectOption value=''>Select a category</SelectOption>
                    {_data?.categories.map((category) => (
                      <SelectOption key={category.id} value={category.id}>
                        {category.name}
                      </SelectOption>
                    ))}
                  </Select>
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name='price'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={meta.fieldId}>Price</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput {...field} placeholder='0.00' />
                  </InputGroup>
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name='stock'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={meta.fieldId}>Stock</FieldLabel>
                  <Input {...field} type='number' placeholder='0000' />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />
          </FieldGroup>

          <FieldSeparator />

          <form.Field
            name='images'
            render={({ meta, field }) => (
              <FieldGroup>
                <FieldLabel htmlFor={meta.fieldId}>Images</FieldLabel>
                <FieldDescription id={meta.descriptionId}>
                  Add URLs of images for the product. You can add multiple
                  images.
                </FieldDescription>
                {field.value.map((url, index) => (
                  // eslint-disable-next-line @eslint-react/no-array-index-key
                  <Field key={`image-${index}`}>
                    <InputGroup>
                      <InputGroupInput
                        value={url}
                        onChange={(e) => {
                          const newImages = [...field.value]
                          newImages[index] = e.target.value
                          field.onChange(newImages)
                        }}
                        placeholder='https://example.com/image.jpg'
                      />
                      <InputGroupAddon align='inline-end'>
                        <InputGroupButton
                          onClick={() => {
                            const newImages = field.value.filter(
                              (_, i) => i !== index,
                            )
                            field.onChange(newImages)
                          }}
                        >
                          <MinusIcon />
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                ))}
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() => {
                    field.onChange([...field.value, ''])
                  }}
                >
                  Add Image URL
                </Button>

                <FieldError id={meta.errorId} errors={meta.errors} />
              </FieldGroup>
            )}
          />

          <FieldSeparator />

          <form.Field
            name='attributes'
            render={({ meta, field }) => (
              <FieldGroup>
                <FieldLabel htmlFor={meta.fieldId}>Attributes</FieldLabel>
                <FieldDescription id={meta.descriptionId}>
                  Define custom attributes for the product.
                </FieldDescription>
                {field.value.map((attribute, index) => (
                  // eslint-disable-next-line @eslint-react/no-array-index-key
                  <Field key={`attribute-${index}`}>
                    <div className='flex gap-2'>
                      <Input
                        value={attribute.name}
                        onChange={(e) => {
                          const newAttributes = [...field.value]
                          if (!newAttributes[index]) return
                          newAttributes[index].name = e.target.value
                          field.onChange(newAttributes)
                        }}
                        placeholder='e.g., material, brand'
                      />
                      <Input
                        value={attribute.value}
                        onChange={(e) => {
                          const newAttributes = [...field.value]
                          if (!newAttributes[index]) return
                          newAttributes[index].value = e.target.value
                          field.onChange(newAttributes)
                        }}
                        placeholder='e.g., cotton, nike'
                      />
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => {
                          field.onChange(
                            field.value.filter((_, i) => i !== index),
                          )
                        }}
                      >
                        <MinusIcon />
                      </Button>
                    </div>
                  </Field>
                ))}

                <Field>
                  <Button
                    type='button'
                    variant='secondary'
                    onClick={() => {
                      field.onChange([...field.value, { name: '', value: '' }])
                    }}
                  >
                    Add Attribute
                  </Button>
                </Field>

                <FieldError id={meta.errorId} errors={meta.errors} />
              </FieldGroup>
            )}
          />

          <Field>
            <Button type='submit' disabled={form.state.isPending}>
              {form.state.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
