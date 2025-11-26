/* eslint-disable @eslint-react/no-array-index-key */
import * as React from 'react'
import { useMutation } from '@tanstack/react-query'
import { useLoaderData, useNavigate } from 'react-router'

import { Button } from '@yukinu/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { XIcon } from '@yukinu/ui/icons'
import { Input } from '@yukinu/ui/input'
import { Select, SelectOption } from '@yukinu/ui/select'
import { toast } from '@yukinu/ui/sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'
import { Textarea } from '@yukinu/ui/textarea'
import { ProductModels } from '@yukinu/validators/product'

import type { Route } from './+types/[id]'
import { useTRPC } from '@/trpc/react'
import { createApi } from '@/trpc/rsc'

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const api = createApi(request)

  const categories = await api.category.all({ limit: 100 })
  const product = await api.product.one({ productId: params.id })

  return { categories, product }
}

export default function DashboardProductsCreate({
  loaderData,
}: Route.ComponentProps) {
  return (
    <main className='container py-4'>
      <h1 className='mb-2 text-3xl font-extrabold'>
        Edit: {loaderData.product.name}
      </h1>
      <p className='mb-4 text-muted-foreground'>
        Modify the details of your product below.
      </p>

      <section className='rounded-lg bg-card p-4 shadow'>
        <EditProductForm />
      </section>
    </main>
  )
}

const EditProductForm: React.FC = () => {
  const data = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  const trpc = useTRPC()
  const { mutateAsync } = useMutation({
    ...trpc.product.update.mutationOptions(),
    meta: { filter: trpc.product.allByVendor.queryFilter() },
    onSuccess: () => toast.success('Product updated successfully'),
    onError: ({ message }) => toast.error(message),
  })

  const form = useForm({
    defaultValues: {
      productId: data.product.id,
      name: data.product.name,
      categoryId: data.product.category.id,
      description: data.product.description,
      price: data.product.price,
      stock: data.product.stock,
      images: data.product.images,
      variantGroups: data.product.variantGroups,
    } as ProductModels.UpdateInput, // @ts-expect-error ts(2322) - Zod inference issue
    schema: ProductModels.updateInput,
    onSubmit: mutateAsync,
    onSuccess: () => void navigate('/products'),
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <FieldSet>
        <legend className='sr-only'>Product Information</legend>

        <FieldGroup>
          <FieldGroup>
            <form.Field
              name='name'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={meta.fieldId}>Product Name</FieldLabel>
                  <Input {...field} />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name='categoryId'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={meta.fieldId}>Category</FieldLabel>
                  <Select {...field} id={meta.fieldId} className='input w-full'>
                    <SelectOption value=''>Select a category</SelectOption>
                    {data.categories.categories.map((category) => (
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
              name='description'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={meta.fieldId}>Description</FieldLabel>
                  <Textarea {...field} />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name='price'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={meta.fieldId}>Price</FieldLabel>
                  <Input type='number' step='0.01' {...field} />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name='stock'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={meta.fieldId}>Stock</FieldLabel>
                  <Input type='number' {...field} />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />
          </FieldGroup>

          <FieldSeparator />

          <FieldGroup>
            <FieldLegend variant='label'>Images</FieldLegend>

            <form.Field
              name='images'
              render={({ meta, field }) => (
                <>
                  {field.value.map((image, idx) => (
                    <Field key={`images.${idx}`} orientation='horizontal'>
                      <Input
                        id={`images.${idx}.url`}
                        placeholder='Image URL'
                        value={image.url}
                        onChange={(e) => {
                          const newImages = [...field.value]
                          if (!newImages[idx]) return
                          newImages[idx] = {
                            ...newImages[idx],
                            url: e.target.value,
                          }
                          field.onChange(newImages)
                        }}
                      />
                      <Input
                        id={`images.${idx}.alt`}
                        placeholder='Alt Text'
                        value={image.alt}
                        onChange={(e) => {
                          const newImages = [...field.value]
                          if (!newImages[idx]) return
                          newImages[idx] = {
                            ...newImages[idx],
                            alt: e.target.value,
                          }
                          field.onChange(newImages)
                        }}
                      />
                      <Button
                        variant='destructive'
                        type='button'
                        onClick={() => {
                          const newImages = field.value.filter(
                            (_, i) => i !== idx,
                          )
                          field.onChange(newImages)
                        }}
                      >
                        <XIcon />
                      </Button>
                    </Field>
                  ))}

                  <Field>
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={() => {
                        field.onChange([...field.value, { url: '', alt: '' }])
                      }}
                    >
                      Add Image
                    </Button>

                    <FieldError id={meta.errorId} errors={meta.errors} />
                  </Field>
                </>
              )}
            />
          </FieldGroup>

          <FieldSeparator />

          <FieldGroup>
            <FieldLegend variant='label'>Variants</FieldLegend>

            <form.Field
              name='variantGroups'
              render={({ meta, field }) => (
                <>
                  {field.value.map((variantGroup, vgIdx) => (
                    <Field
                      key={`variantGroups.${vgIdx}`}
                      className='rounded-md border p-4'
                    >
                      <div className='flex items-center justify-between gap-4'>
                        <Input
                          id={`variantGroups.${vgIdx}.name`}
                          placeholder='Variant Group Name (e.g., Size, Color)'
                          value={variantGroup.name}
                          onChange={(e) => {
                            const newVariantGroups = [...field.value]
                            if (!newVariantGroups[vgIdx]) return
                            newVariantGroups[vgIdx] = {
                              ...newVariantGroups[vgIdx],
                              name: e.target.value,
                            }
                            field.onChange(newVariantGroups)
                          }}
                        />

                        <Button
                          type='button'
                          variant='destructive'
                          onClick={() => {
                            const newVariantGroups = field.value.filter(
                              (_, i) => i !== vgIdx,
                            )
                            field.onChange(newVariantGroups)
                          }}
                        >
                          <XIcon />
                        </Button>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow className='border-transparent hover:bg-transparent'>
                            <TableHead>Variant Name</TableHead>
                            <TableHead>Extra Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {variantGroup.variants.map((variant, vIdx) => (
                            <TableRow
                              key={`variantGroups.${vgIdx}.variants.${vIdx}`}
                              className='border-transparent hover:bg-transparent'
                            >
                              <TableCell>
                                <Input
                                  id={`variantGroups.${vgIdx}.variants.${vIdx}`}
                                  placeholder='Variant Name (e.g., Small, Red)'
                                  value={variant.name}
                                  onChange={(e) => {
                                    const newVariantGroups = [...field.value]
                                    if (!newVariantGroups[vgIdx]) return
                                    const newVariants = [
                                      ...newVariantGroups[vgIdx].variants,
                                    ]
                                    if (!newVariants[vIdx]) return
                                    newVariants[vIdx].name = e.target.value
                                    newVariantGroups[vgIdx] = {
                                      ...newVariantGroups[vgIdx],
                                      variants: newVariants,
                                    }
                                    field.onChange(newVariantGroups)
                                  }}
                                />
                              </TableCell>

                              <TableCell>
                                <Input
                                  type='number'
                                  step='0.01'
                                  id={`variantGroups.${vgIdx}.variants.${vIdx}.extraPrice`}
                                  placeholder='Extra Price'
                                  value={variant.extraPrice}
                                  onChange={(e) => {
                                    const newVariantGroups = [...field.value]
                                    if (!newVariantGroups[vgIdx]) return
                                    const newVariants = [
                                      ...newVariantGroups[vgIdx].variants,
                                    ]
                                    if (!newVariants[vIdx]) return
                                    newVariants[vIdx].extraPrice =
                                      e.target.value
                                    newVariantGroups[vgIdx] = {
                                      ...newVariantGroups[vgIdx],
                                      variants: newVariants,
                                    }
                                    field.onChange(newVariantGroups)
                                  }}
                                />
                              </TableCell>

                              <TableCell>
                                <Input
                                  type='number'
                                  id={`variantGroups.${vgIdx}.variants.${vIdx}.stock`}
                                  placeholder='Stock'
                                  value={variant.stock}
                                  onChange={(e) => {
                                    const newVariantGroups = [...field.value]
                                    if (!newVariantGroups[vgIdx]) return
                                    const newVariants = [
                                      ...newVariantGroups[vgIdx].variants,
                                    ]
                                    if (!newVariants[vIdx]) return
                                    newVariants[vIdx].stock = parseInt(
                                      e.target.value,
                                      10,
                                    )
                                    newVariantGroups[vgIdx] = {
                                      ...newVariantGroups[vgIdx],
                                      variants: newVariants,
                                    }
                                    field.onChange(newVariantGroups)
                                  }}
                                />
                              </TableCell>

                              <TableCell>
                                <Button
                                  variant='destructive'
                                  type='button'
                                  onClick={() => {
                                    const newVariantGroups = [...field.value]
                                    if (!newVariantGroups[vgIdx]) return
                                    const newVariants = newVariantGroups[
                                      vgIdx
                                    ].variants.filter((_, i) => i !== vIdx)
                                    newVariantGroups[vgIdx] = {
                                      ...newVariantGroups[vgIdx],
                                      variants: newVariants,
                                    }
                                    field.onChange(newVariantGroups)
                                  }}
                                >
                                  <XIcon />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      <Field>
                        <Button
                          type='button'
                          variant='secondary'
                          onClick={() => {
                            const newVariantGroups = [...field.value]
                            if (!newVariantGroups[vgIdx]) return
                            const newVariants = [
                              ...newVariantGroups[vgIdx].variants,
                              { name: '', extraPrice: '0.00', stock: 0 },
                            ]
                            newVariantGroups[vgIdx] = {
                              ...newVariantGroups[vgIdx],
                              variants: newVariants,
                            }
                            field.onChange(newVariantGroups)
                          }}
                        >
                          Add Variant
                        </Button>
                      </Field>
                    </Field>
                  ))}

                  <Field>
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={() => {
                        field.onChange([
                          ...field.value,
                          { name: '', variants: [] },
                        ])
                      }}
                    >
                      Add Variant Group
                    </Button>

                    <FieldError id={meta.errorId} errors={meta.errors} />
                  </Field>
                </>
              )}
            />
          </FieldGroup>

          <Field>
            <Button type='submit' disabled={form.state.isPending}>
              Save Changes
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
