import type { OneCategoryDto } from '@yukinu/api/catalog'

import { useMutation, useQuery } from '@tanstack/react-query'
import { SaveCategoryDto } from '@yukinu/api/catalog'
import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
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

export const SaveCategoryForm: React.FC<{
  category?: OneCategoryDto.Output
}> = ({ category }) => {
  const { trpc } = useTRPC()
  const navigate = useNavigate()

  const { data } = useQuery(
    trpc.catalog.category.all.queryOptions({
      isTopLevelOnly: true,
      limit: 999,
    }),
  )

  const saveCategory = useMutation({
    ...trpc.catalog.category.save.mutationOptions(),
    meta: {
      filter: [
        trpc.catalog.category.all.queryFilter(),
        ...(category?.id
          ? [trpc.catalog.category.one.queryFilter({ id: category.id })]
          : []),
      ],
    },
    onSuccess: () => [
      navigate('/catalog/categories'),
      toast.success({
        message: `Category ${category?.id ? 'updated' : 'created'} successfully`,
      }),
    ],
    onError: toast.error,
  })

  const form = useForm({
    defaultValues: {
      ...(category?.id && { id: category.id }),
      name: category?.name ?? '',
      description: category?.description ?? '',
      image: category?.image ?? undefined,
      parentId: category?.parentId ?? null,
    },
    schema: SaveCategoryDto.input,
    onSubmit: saveCategory.mutateAsync,
  })

  return (
    <Card
      className='my-4'
      render={<form id={form.formId} onSubmit={form.handleSubmit} />}
    >
      <FieldSet className='px-4'>
        <FieldGroup>
          <form.Field
            name='name'
            render={({ field, meta }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Name</FieldLabel>
                <Input {...field} placeholder='Enter category name' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='description'
            render={({ field, meta }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Description</FieldLabel>
                <Textarea {...field} placeholder='Enter category description' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='parentId'
            render={({ field, meta }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Parent Category</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  items={data?.categories.map(({ id, name }) => ({
                    label: name,
                    value: id,
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select parent category (optional)' />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    {data?.categories.map(({ id, name }) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='image'
            render={({ field, meta }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Image URL</FieldLabel>
                <UploadInput
                  endpoint='categoryImageUploader'
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                />
                <FieldError id={meta.errorId} errors={meta.errors} />
                {field.value && (
                  <FieldContent className='items-center'>
                    <img
                      src={field.value}
                      alt={`Preview of ${form.state.values.name}`}
                      className='size-32 rounded-lg object-cover'
                    />
                  </FieldContent>
                )}
              </Field>
            )}
          />

          <Field>
            <Button type='submit' disabled={form.state.isPending}>
              {category?.id ? 'Save Changes' : 'Create Category'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </Card>
  )
}
