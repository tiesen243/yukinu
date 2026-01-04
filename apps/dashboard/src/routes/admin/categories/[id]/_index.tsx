import type { Route } from './+types/_index'

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
import { toast } from '@yukinu/ui/sonner'
import {
  updateCategoryInput,
  type UpdateCategoryInput,
} from '@yukinu/validators/general'
import { useNavigate } from 'react-router'

import { InputGroupUploadButton } from '@/components/input-group-upload-button'
import { useTRPC } from '@/lib/trpc/react'
import { createTRPC, getQueryClient } from '@/lib/trpc/rsc'

export const loader = ({ request, params }: Route.LoaderArgs) => {
  const trpc = createTRPC(request)
  return getQueryClient().ensureQueryData(
    trpc.category.one.queryOptions(params),
  )
}

export default function CategoriesEditPage({
  loaderData,
}: Route.ComponentProps) {
  const trpc = useTRPC()
  const navigate = useNavigate()

  const { data: category, refetch } = useQuery({
    ...trpc.category.one.queryOptions({ id: loaderData.id }),
    initialData: loaderData,
  })

  const { data } = useQuery(
    trpc.category.all.queryOptions({ search: '', limit: 100 }),
  )

  const { mutateAsync } = useMutation({
    ...trpc.category.update.mutationOptions(),
    meta: { filter: trpc.category.all.queryFilter() },
    onSuccess: () => toast.success('Category updated successfully'),
    onError: ({ message }) =>
      toast.error('Failed to update category', { description: message }),
  })

  const form = useForm({
    defaultValues: {
      id: category.id,
      parentId: category.parent?.id,
      name: category.name,
      description: category.description,
      image: category.image,
    } as UpdateCategoryInput,
    schema: updateCategoryInput,
    onSubmit: mutateAsync,
    onSuccess: () => {
      void refetch()
      void navigate('/admin/categories')
    },
  })

  return (
    <Card render={<form onSubmit={form.handleSubmit} />}>
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
                <FieldLabel htmlFor={meta.fieldId}>Name</FieldLabel>
                <Input {...field} placeholder='Category Name' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='description'
            render={({ meta, field: { value = '', ...field } }) => (
              <Field
                data-invalid={meta.errors.length > 0 || value.length > 1000}
              >
                <FieldLabel htmlFor={meta.fieldId}>Description</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    value={value}
                    aria-invalid={field['aria-invalid'] || value.length > 1000}
                    placeholder='Category Description'
                  />
                  <InputGroupAddon align='block-end' className='justify-end'>
                    <InputGroupText>{value.length ?? 0}/1000</InputGroupText>
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
                <FieldLabel htmlFor={meta.fieldId}>Image URL</FieldLabel>
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
                      onUploadComplete={(url) => {
                        form.setValue('image', url)
                      }}
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
                <FieldLabel htmlFor={meta.fieldId}>Parent Category</FieldLabel>
                <NativeSelect {...field} value={value ?? ''}>
                  {data?.categories
                    .filter((cat) => cat.id !== category.id)
                    .map((category) => (
                      <NativeSelectOption key={category.id} value={category.id}>
                        {category.name}
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
