import type { RouterOutputs } from '@yukinu/api'

import { useMutation, useQuery } from '@tanstack/react-query'
import { SaveCategoryDto } from '@yukinu/api/catalog'
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@yukinu/ui/input-group'
import { NativeSelect, NativeSelectOption } from '@yukinu/ui/native-select'
import { toast } from '@yukinu/ui/toast'
import { useNavigate } from 'react-router'

import { InputGroupUploadButton } from '@/components/input-group-upload-button'
import { useTRPC } from '@/lib/trpc/react'

import type { Route } from './+types/[id]'

export default function CategoriesEditPage({ params }: Route.ComponentProps) {
  const { trpc } = useTRPC()

  const { data: category, refetch } = useQuery(
    trpc.catalog.category.one.queryOptions({ id: params.id }),
  )

  const { data: categories } = useQuery(
    trpc.catalog.category.all.queryOptions({ search: '', limit: 100 }),
  )

  if (!category || !categories)
    return (
      <Card>
        <FieldSet className='px-4'>
          <FieldLegend>Loading Category...</FieldLegend>
          <FieldDescription>
            Please wait while we load the category details.
          </FieldDescription>
        </FieldSet>
      </Card>
    )

  return (
    <CategoriesEditFrom
      category={category}
      categories={categories.categories}
      refetch={refetch}
    />
  )
}

const CategoriesEditFrom: React.FC<{
  category: RouterOutputs['catalog']['category']['one']
  categories: RouterOutputs['catalog']['category']['all']['categories']
  refetch: () => void
}> = ({ category, categories, refetch }) => {
  const { trpc } = useTRPC()
  const navigate = useNavigate()

  const { mutateAsync } = useMutation({
    ...trpc.catalog.category.save.mutationOptions(),
    meta: { filter: trpc.catalog.category.all.queryFilter() },
    onSuccess: () =>
      toast.add({
        type: 'success',
        title: 'Category updated successfully',
      }),
    onError: ({ message }) =>
      toast.add({
        type: 'error',
        title: 'Failed to update category',
        description: message,
      }),
  })

  const form = useForm({
    defaultValues: {
      id: category.id,
      parentId: category.parentId,
      name: category.name,
      description: category.description,
      image: category.image,
    },
    schema: SaveCategoryDto.input,
    onSubmit: mutateAsync,
    onSuccess: () => {
      void navigate('/admin/categories')
      void refetch()
    },
  })

  return (
    <Card id={form.formId} render={<form onSubmit={form.handleSubmit} />}>
      <FieldSet className='px-4'>
        <FieldLegend>Edit Category</FieldLegend>
        <FieldDescription>
          Use the form below to edit the category in the system.
        </FieldDescription>

        <FieldGroup>
          <form.Field
            name='name'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Name</FieldLabel>
                <Input {...field} placeholder='Category Name' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='description'
            render={({ meta, field: { value, ...field } }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Description</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    value={value ?? ''}
                    aria-invalid={field['aria-invalid']}
                    placeholder='Category Description'
                  />
                  <InputGroupAddon align='block-end' className='justify-end'>
                    <InputGroupText>{value?.length ?? 0}/1000</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='image'
            render={({ meta, field: { value, ...field } }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Image URL</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    type='url'
                    value={value ?? ''}
                    placeholder='https://example.com/image.jpg'
                  />
                  <InputGroupAddon align='inline-end'>
                    <InputGroupUploadButton
                      endpoint='categoryImageUploader'
                      onUploadComplete={(url) => field.onChange(url)}
                    />
                  </InputGroupAddon>
                </InputGroup>
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='parentId'
            render={({ meta, field: { value, ...field } }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Parent Category</FieldLabel>
                <NativeSelect {...field} value={value ?? ''}>
                  {categories
                    .filter((cat) => cat.id !== category.id)
                    .map((cat) => (
                      <NativeSelectOption key={cat.id} value={cat.id}>
                        {cat.name}
                      </NativeSelectOption>
                    ))}
                </NativeSelect>
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
