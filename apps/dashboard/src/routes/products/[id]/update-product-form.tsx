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
  InputGroupTextarea,
} from '@yukinu/ui/input-group'
import { NativeSelect, NativeSelectOption } from '@yukinu/ui/native-select'
import { toast } from '@yukinu/ui/sonner'
import { ProductValidators } from '@yukinu/validators/product'

import { useTRPC } from '@/lib/trpc/react'

export const UpdateProductForm: React.FC<{
  data: ProductValidators.OneOutput
}> = ({ data }) => {
  const trpc = useTRPC()

  const { data: product, refetch } = useQuery({
    ...trpc.product.one.queryOptions({ id: data.id }),
    initialData: data,
  })
  const { data: _data } = useQuery(
    trpc.category.all.queryOptions({ search: null, limit: 100 }),
  )
  const { mutateAsync } = useMutation({
    ...trpc.product.update.mutationOptions(),
    meta: { filter: trpc.product.allByVendor.queryFilter() },
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
      description: product.description,
      categoryId: product.category?.id ?? null,
      price: product.price,
      stock: product.stock,
      images: product.images.map((img) => img.url),
      attributes: product.attributes,
    } as Omit<ProductValidators.UpdateInput, 'vendorId'>,
    schema: ProductValidators.updateInput.omit({ vendorId: true }),
    onSubmit: mutateAsync,
  })

  return (
    <Card render={<form onSubmit={form.handleSubmit} />}>
      <FieldSet className='px-4'>
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
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      placeholder='Write a brief description about the product'
                    />
                    <InputGroupAddon align='block-end'>
                      <InputGroupText
                        className={`ml-auto ${field.value && field.value.length > 2000 ? 'text-destructive' : ''}`}
                      >
                        {field.value?.length ?? 0}/2000
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name='categoryId'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={meta.fieldId}>Category</FieldLabel>
                  <NativeSelect {...field} value={field.value ?? ''}>
                    <NativeSelectOption value='' disabled>
                      Select a category
                    </NativeSelectOption>
                    {_data?.categories.map((category) => (
                      <NativeSelectOption key={category.id} value={category.id}>
                        {category.name}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
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
                        aria-label={`Image URL ${index + 1}`}
                      />
                      <InputGroupAddon align='inline-end'>
                        <InputGroupButton
                          onClick={() => {
                            if (field.value.length === 1) return

                            const newImages = field.value.filter(
                              (_, i) => i !== index,
                            )
                            field.onChange(newImages)
                          }}
                        >
                          <MinusIcon />
                          <span className='sr-only'>Remove Image URL</span>
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                ))}
                <Button
                  type='button'
                  variant='outline'
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
                        aria-label='Attribute Name'
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
                        aria-label='Attribute Value'
                      />
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => {
                          field.onChange(
                            field.value.filter((_, i) => i !== index),
                          )
                        }}
                      >
                        <MinusIcon />
                        <span className='sr-only'>Remove Attribute</span>
                      </Button>
                    </div>
                  </Field>
                ))}

                <Field>
                  <Button
                    type='button'
                    variant='outline'
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
    </Card>
  )
}
