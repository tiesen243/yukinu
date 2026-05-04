import type { AllCategoriesDto, OneProductDto } from '@yukinu/api/catalog'
import type { UseFormReturn } from '@yukinu/ui/hooks/use-form'

import { useQuery } from '@tanstack/react-query'
import { SaveProductDto } from '@yukinu/api/catalog'
import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { XIcon } from '@yukinu/ui/icons'
import { Input } from '@yukinu/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@yukinu/ui/input-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@yukinu/ui/select'
import { Textarea } from '@yukinu/ui/textarea'
import { toast } from '@yukinu/ui/toast'
import { useNavigate } from 'react-router'

import { UploadInput } from '@/components/upload-input'
import { useTRPC } from '@/lib/trpc'

export const SaveProductForm: React.FC<{
  product?: OneProductDto.Output
  // oxlint-disable-next-line complexity
}> = ({ product }) => {
  const { trpcClient, trpc, queryClient } = useTRPC()
  const navigate = useNavigate()

  const { data } = useQuery(
    trpc.catalog.category.all.queryOptions({ limit: 100 }),
  )

  const form = useForm({
    defaultValues: {
      ...(product?.id ? { id: product.id } : {}),
      name: product?.name ?? '',
      description: product?.description ?? '',
      categoryId: product?.category?.id ?? null,
      price: product?.price ?? '',
      stock: product?.stock ?? 0,
      images: product?.images.map((img) => img.url) ?? [],
      attributes: product?.attributes ?? [],
      variants: [],
    } as Omit<SaveProductDto.Input, 'vendorId'>,
    schema: SaveProductDto.input.omit({ vendorId: true }),
    onSubmit: product?.id
      ? trpcClient.catalog.product.update.mutate
      : trpcClient.catalog.product.create.mutate,
    onSuccess: () => [
      toast.success({
        message: `Product ${product?.id ? 'updated' : 'created'} successfully`,
      }),
      queryClient.invalidateQueries(
        trpc.catalog.product.allByVendor.queryFilter(),
      ),
      ...(product?.id
        ? [
            queryClient.invalidateQueries(
              trpc.catalog.product.one.queryFilter({ id: product?.id }),
            ),
          ]
        : []),
      navigate('/catalog/products'),
    ],
    onError: toast.error,
  })

  return (
    <form id={form.formId} onSubmit={form.handleSubmit}>
      <Card
        className='mt-4 px-4'
        render={<fieldset disabled={form.state.isPending} />}
      >
        <FieldLegend>Product Information</FieldLegend>
        <FieldDescription>
          Provide the basic information about the product, including its name,
          description, price, stock quantity, and category. This information
          will be displayed to customers when they view the product.
        </FieldDescription>

        <ProductInformationFields form={form} categories={data?.categories} />
      </Card>

      <Card
        className='mt-4 px-4'
        render={<fieldset disabled={form.state.isPending} />}
      >
        <FieldLegend>Product Images</FieldLegend>
        <FieldDescription>
          Upload images of the product to showcase it to customers. You can add
          multiple images, and they will be displayed in the order you add them.
        </FieldDescription>

        <ProductImagesFields form={form} />
      </Card>

      <Card
        className='mt-4 px-4'
        render={<fieldset disabled={form.state.isPending} />}
      >
        <FieldLegend>Product Attributes</FieldLegend>
        <FieldDescription>
          Add custom attributes to the product to provide additional information
          to customers. Attributes can include things like color, size,
          material, etc. You can add as many attributes as needed.
        </FieldDescription>

        <ProductAttributesFields form={form} />
      </Card>

      {!product?.id && (
        <Card
          className='mt-4 px-4'
          render={<fieldset disabled={form.state.isPending} />}
        >
          <FieldLegend>Product Variants</FieldLegend>
          <FieldDescription>
            Add variants to the product to offer different options to customers.
            Variants can include things like different colors, sizes, etc. You
            can add as many variants as needed.
          </FieldDescription>

          <ProductVariantsFields form={form} />
        </Card>
      )}

      <Button
        type='submit'
        className='my-4 w-full'
        disabled={form.state.isPending}
      >
        {product?.id ? 'Save Changes' : 'Create Product'}
      </Button>
    </form>
  )
}

function ProductInformationFields({
  form,
  categories,
}: {
  form: UseFormReturn<Omit<SaveProductDto.Input, 'vendorId'>, unknown>
  categories?: AllCategoriesDto.Output['categories']
}) {
  return (
    <FieldGroup>
      <form.Field
        name='name'
        render={({ field, meta }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={field.id}>Product Name</FieldLabel>
            <Input {...field} placeholder='Enter product name' />
            <FieldError id={meta.errorId} errors={meta.errors} />
          </Field>
        )}
      />

      <form.Field
        name='description'
        render={({ field, meta }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={field.id}>Description</FieldLabel>
            <Textarea {...field} placeholder='Enter product description' />
            <FieldError id={meta.errorId} errors={meta.errors} />
          </Field>
        )}
      />

      <form.Field
        name='price'
        render={({ field, meta }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={field.id}>Price</FieldLabel>
            <Input {...field} placeholder='Enter product price' />
            <FieldError id={meta.errorId} errors={meta.errors} />
          </Field>
        )}
      />

      <form.Field
        name='stock'
        render={({ field, meta }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={field.id}>Stock Quantity</FieldLabel>
            <Input
              {...field}
              type='number'
              min={0}
              step={1}
              placeholder='Enter stock quantity'
            />
            <FieldError id={meta.errorId} errors={meta.errors} />
          </Field>
        )}
      />

      <form.Field
        name='categoryId'
        render={({ field, meta }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={field.id}>Category</FieldLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              items={categories?.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a category' />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError id={meta.errorId} errors={meta.errors} />
          </Field>
        )}
      />
    </FieldGroup>
  )
}

function ProductImagesFields({
  form,
}: {
  form: UseFormReturn<Omit<SaveProductDto.Input, 'vendorId'>, unknown>
}) {
  return (
    <FieldGroup>
      <form.Field
        name='images'
        render={({ field, meta }) => (
          <>
            {field.value?.map((image: string, i: number) => (
              <Field key={`${i}-${image}`} orientation='horizontal'>
                <UploadInput
                  endpoint='productImageUploader'
                  value={image}
                  onValueChange={(url) =>
                    field.onChange([
                      ...field.value.filter((img: string) => img !== image),
                      url,
                    ])
                  }
                  aria-describedby={field['aria-describedby']}
                  aria-invalid={field['aria-invalid']}
                />

                {image && (
                  <img
                    src={image}
                    alt={`Preview ${i + 1}`}
                    className='size-16 rounded object-cover'
                  />
                )}

                <Button
                  type='button'
                  variant='destructive'
                  size='icon'
                  onClick={() =>
                    field.onChange(
                      field.value.filter((_: string, idx: number) => idx !== i),
                    )
                  }
                >
                  <XIcon />
                  <span className='sr-only'>Remove Image</span>
                </Button>
              </Field>
            ))}

            <Button
              type='button'
              variant='secondary'
              onClick={() => field.onChange([...field.value, ''])}
            >
              Add Image
            </Button>

            <FieldError id={meta.errorId} errors={meta.errors} />
          </>
        )}
      />
    </FieldGroup>
  )
}

function ProductAttributesFields({
  form,
}: {
  form: UseFormReturn<Omit<SaveProductDto.Input, 'vendorId'>, unknown>
}) {
  return (
    <form.Field
      name='attributes'
      render={({ field, meta }) => (
        <>
          {field.value?.map(
            (attr: { name: string; value: string }, i: number) => (
              <Field key={i} orientation='horizontal'>
                <Input
                  id={`${field.id}-name-${i}`}
                  value={attr.name}
                  onChange={(e) => {
                    const newAttr = [...field.value]
                    if (!newAttr[i]) return
                    newAttr[i].name = e.target.value
                    field.onChange(newAttr)
                  }}
                  list={`${field.id}-attr-suggestions`}
                  placeholder='Attribute Name'
                  aria-describedby={field['aria-describedby']}
                  aria-invalid={field['aria-invalid']}
                />
                <datalist id={`${field.id}-attr-suggestions`}>
                  {SUGGESTED_ATTRIBUTES.map((suggestion) => (
                    <option key={suggestion} value={suggestion} />
                  ))}
                </datalist>
                <Input
                  id={`${field.id}-value-${i}`}
                  value={attr.value}
                  onChange={(e) => {
                    const newAttr = [...field.value]
                    if (!newAttr[i]) return
                    newAttr[i].value = e.target.value
                    field.onChange(newAttr)
                  }}
                  placeholder='Attribute Value'
                  aria-describedby={field['aria-describedby']}
                  aria-invalid={field['aria-invalid']}
                />
                <Button
                  type='button'
                  variant='destructive'
                  size='icon'
                  onClick={() =>
                    field.onChange(
                      field.value.filter((_, idx: number) => idx !== i),
                    )
                  }
                >
                  <XIcon />
                  <span className='sr-only'>Remove Attribute</span>
                </Button>
              </Field>
            ),
          )}
          <Button
            type='button'
            variant='secondary'
            onClick={() =>
              field.onChange([...field.value, { name: '', value: '' }])
            }
          >
            Add Attribute
          </Button>

          <FieldError id={meta.errorId} errors={meta.errors} />
        </>
      )}
    />
  )
}

export function ProductVariantsFields({
  form,
}: {
  form: UseFormReturn<Omit<SaveProductDto.Input, 'vendorId'>, unknown>
}) {
  return (
    <FieldGroup>
      <form.Field
        name='variants'
        render={({ field, meta }) => (
          <>
            {field.value?.map(
              (variant: { name: string; options: string[] }, i: number) => (
                <FieldGroup key={i}>
                  <FieldLabel>Variant {i + 1}</FieldLabel>
                  <FieldContent>
                    <InputGroup>
                      <InputGroupInput
                        placeholder='Variant Name'
                        value={variant.name}
                        onChange={(e) => {
                          const newVariants = [...field.value]
                          if (!newVariants[i]) return
                          newVariants[i].name = e.target.value
                          field.onChange(newVariants)
                        }}
                        list={`${field.id}-variant-suggestions`}
                        aria-describedby={field['aria-describedby']}
                        aria-invalid={field['aria-invalid']}
                      />
                      <datalist id={`${field.id}-variant-suggestions`}>
                        {SUGGESTED_VARIANTS.map((suggestion) => (
                          <option key={suggestion} value={suggestion} />
                        ))}
                      </datalist>
                      <InputGroupAddon align='inline-end'>
                        <InputGroupButton
                          type='button'
                          variant='destructive'
                          size='icon-xs'
                          onClick={() =>
                            field.onChange(
                              field.value.filter((_, idx: number) => idx !== i),
                            )
                          }
                        >
                          <XIcon />
                          <span className='sr-only'>Remove Variant</span>
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>

                    {variant.options.map((option, j) => (
                      <InputGroup key={j} className='mt-2'>
                        <InputGroupInput
                          placeholder='Option Value'
                          value={option}
                          onChange={(e) => {
                            const newVariants = [...field.value]
                            if (!newVariants[i]) return
                            newVariants[i].options[j] = e.target.value
                            field.onChange(newVariants)
                          }}
                          aria-describedby={field['aria-describedby']}
                          aria-invalid={field['aria-invalid']}
                        />
                        <InputGroupAddon align='inline-end'>
                          <InputGroupButton
                            type='button'
                            variant='destructive'
                            size='icon-xs'
                            onClick={() => {
                              const newVariants = [...field.value]
                              if (!newVariants[i]) return
                              newVariants[i].options = newVariants[
                                i
                              ].options.filter((_, idx: number) => idx !== j)
                              field.onChange(newVariants)
                            }}
                          >
                            <XIcon />
                            <span className='sr-only'>Remove Option</span>
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                    ))}

                    <Button
                      type='button'
                      variant='secondary'
                      className='mt-2'
                      onClick={() => {
                        const newVariants = [...field.value]
                        if (!newVariants[i]) return
                        newVariants[i].options.push('')
                        field.onChange(newVariants)
                      }}
                    >
                      Add Option
                    </Button>
                  </FieldContent>
                </FieldGroup>
              ),
            )}

            <Button
              type='button'
              variant='secondary'
              onClick={() =>
                field.onChange([...field.value, { name: '', options: [] }])
              }
            >
              Add Variant
            </Button>

            <FieldError id={meta.errorId} errors={meta.errors} />
          </>
        )}
      />
    </FieldGroup>
  )
}

const SUGGESTED_ATTRIBUTES = [
  'Color',
  'Size',
  'Material',
  'Brand',
  'Model',
  'Weight',
  'Dimensions',
  'Style',
  'Gender',
  'Warranty',
  'Condition',
]
const SUGGESTED_VARIANTS = [
  'Color',
  'Size',
  'Material',
  'Style',
  'Pattern',
  'Fit',
]
