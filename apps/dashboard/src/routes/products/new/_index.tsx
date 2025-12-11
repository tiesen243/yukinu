/* eslint-disable @eslint-react/no-array-index-key */
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
  InputGroupTextarea,
} from '@yukinu/ui/input-group'
import { Select, SelectOption } from '@yukinu/ui/select'
import { toast } from '@yukinu/ui/sonner'
import { ProductValidators } from '@yukinu/validators/product'

import { useTRPC } from '@/lib/trpc/react'

export default function ProductsNewPage() {
  const trpc = useTRPC()
  const navigate = useNavigate()

  const { data } = useQuery(
    trpc.category.all.queryOptions({ search: null, limit: 100 }),
  )
  const { mutateAsync } = useMutation({
    ...trpc.product.create.mutationOptions(),
    meta: { filter: trpc.product.all.queryFilter() },
    onSuccess: () => toast.success('Product created successfully!'),
    onError: ({ message }) =>
      toast.error('Failed to create product', { description: message }),
  })

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      price: '',
      stock: 0,
      images: [''],
      attributes: [],
      variants: [],
    } as Omit<ProductValidators.CreateInput, 'vendorId'>,
    schema: ProductValidators.createInput.omit({ vendorId: true }),
    onSubmit: mutateAsync,
    onSuccess: () => void navigate('/products'),
  })

  return (
    <>
      <h1 className='sr-only'>New Product page</h1>

      <form
        onSubmit={form.handleSubmit}
        className='rounded-lg bg-card p-6 text-card-foreground shadow-sm dark:border'
      >
        <FieldSet>
          <FieldLegend>New Product</FieldLegend>
          <FieldDescription>
            Fill out the form below to add a new product to the catalog.
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
                    <Select {...field}>
                      <SelectOption value=''>Select a category</SelectOption>
                      {data?.categories.map((category) => (
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
                    <FieldDescription id={meta.descriptionId}>
                      Leave blank or set to 0.00 if the product has variants, as
                      each variant can have its own price.
                    </FieldDescription>
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
                <FieldGroup data-invalid={meta.errors.length > 0}>
                  <FieldLabel
                    htmlFor={meta.fieldId}
                    className={meta.errors.length > 0 ? 'text-destructive' : ''}
                  >
                    Images
                  </FieldLabel>
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
                          aria-describedby={field['aria-describedby']}
                          aria-invalid={field['aria-invalid']}
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
                      <FieldError />
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
                  <FieldLabel
                    htmlFor={meta.fieldId}
                    className={meta.errors.length > 0 ? 'text-destructive' : ''}
                  >
                    Attributes
                  </FieldLabel>
                  <FieldDescription id={meta.descriptionId}>
                    Define custom attributes for the product (e.g., material,
                    brand).
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
                          placeholder='e.g., Color, Size'
                          aria-label='Attribute Name'
                          aria-describedby={field['aria-describedby']}
                          aria-invalid={field['aria-invalid']}
                        />
                        <Input
                          value={attribute.value}
                          onChange={(e) => {
                            const newAttributes = [...field.value]
                            if (!newAttributes[index]) return
                            newAttributes[index].value = e.target.value
                            field.onChange(newAttributes)
                          }}
                          placeholder='e.g., Red, Large'
                          aria-label='Attribute Value'
                          aria-describedby={field['aria-describedby']}
                          aria-invalid={field['aria-invalid']}
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
                        field.onChange([
                          ...field.value,
                          { name: '', value: '' },
                        ])
                      }}
                    >
                      Add Attribute
                    </Button>
                  </Field>

                  <FieldError id={meta.errorId} errors={meta.errors} />
                </FieldGroup>
              )}
            />

            <FieldSeparator />

            <form.Field
              name='variants'
              render={({ meta, field }) => (
                <FieldGroup>
                  <FieldLabel
                    htmlFor={meta.fieldId}
                    className={meta.errors.length > 0 ? 'text-destructive' : ''}
                  >
                    Variants
                  </FieldLabel>
                  <FieldDescription id={meta.descriptionId}>
                    Define product variants and their options (e.g., Size:
                    Small, Medium, Large).
                  </FieldDescription>
                  {field.value.map((variant, vIndex) => (
                    <FieldGroup key={`variant-${vIndex}`}>
                      <Field>
                        <FieldLabel>Variant Name</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            value={variant.name}
                            onChange={(e) => {
                              const newVariants = [...field.value]
                              if (!newVariants[vIndex]) return
                              newVariants[vIndex].name = e.target.value
                              field.onChange(newVariants)
                            }}
                            placeholder='e.g., Size'
                            aria-label='Variant Name'
                            aria-describedby={field['aria-describedby']}
                            aria-invalid={field['aria-invalid']}
                          />
                          <InputGroupAddon align='inline-end'>
                            <InputGroupButton
                              type='button'
                              onClick={() => {
                                field.onChange(
                                  field.value.filter((_, i) => i !== vIndex),
                                )
                              }}
                            >
                              <MinusIcon />
                              <span className='sr-only'>Remove Variant</span>
                            </InputGroupButton>
                          </InputGroupAddon>
                        </InputGroup>
                      </Field>

                      <FieldGroup>
                        <FieldLabel>Options</FieldLabel>
                        {variant.options.map((option, oIndex) => (
                          <Field key={`variant-${vIndex}-option-${oIndex}`}>
                            <InputGroup>
                              <InputGroupInput
                                value={option}
                                onChange={(e) => {
                                  const newVariants = [...field.value]
                                  if (!newVariants[vIndex]) return
                                  newVariants[vIndex].options[oIndex] =
                                    e.target.value
                                  field.onChange(newVariants)
                                }}
                                placeholder='e.g., s, m, l'
                                aria-label='Variant Option'
                                aria-describedby={field['aria-describedby']}
                                aria-invalid={field['aria-invalid']}
                              />
                              <InputGroupAddon align='inline-end'>
                                <InputGroupButton
                                  type='button'
                                  onClick={() => {
                                    const newVariants = [...field.value]
                                    if (!newVariants[vIndex]) return
                                    newVariants[vIndex].options = newVariants[
                                      vIndex
                                    ].options.filter((_, i) => i !== oIndex)
                                    field.onChange(newVariants)
                                  }}
                                >
                                  <MinusIcon />
                                  <span className='sr-only'>Remove Option</span>
                                </InputGroupButton>
                              </InputGroupAddon>
                            </InputGroup>
                            <FieldError />
                          </Field>
                        ))}
                      </FieldGroup>

                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => {
                          field.onChange(
                            field.value.map((v, i) =>
                              i === vIndex
                                ? { ...v, options: [...v.options, ''] }
                                : v,
                            ),
                          )
                        }}
                      >
                        Add Option
                      </Button>

                      <FieldSeparator />
                    </FieldGroup>
                  ))}

                  <Field>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => {
                        field.onChange([
                          ...field.value,
                          { name: '', options: [''] },
                        ])
                      }}
                    >
                      Add Variant
                    </Button>
                  </Field>

                  <FieldError id={meta.errorId} errors={meta.errors} />
                </FieldGroup>
              )}
            />

            <Field>
              <Button type='submit' disabled={form.state.isPending}>
                {form.state.isPending ? 'Creating...' : 'Create Product'}
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </>
  )
}
