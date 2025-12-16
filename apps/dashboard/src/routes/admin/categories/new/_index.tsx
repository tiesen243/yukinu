import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

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
import { Select, SelectOption } from '@yukinu/ui/select'
import { toast } from '@yukinu/ui/sonner'
import { Textarea } from '@yukinu/ui/textarea'
import { CategoryValidators } from '@yukinu/validators/category'

import { useTRPC } from '@/lib/trpc/react'

export default function CategoriesNewPage() {
  const trpc = useTRPC()
  const navigate = useNavigate()

  const { data } = useQuery(
    trpc.category.all.queryOptions({ search: null, limit: 100 }),
  )

  const { mutateAsync } = useMutation({
    ...trpc.category.create.mutationOptions(),
    meta: { filter: trpc.category.all.queryFilter() },
    onSuccess: () => toast.success('Category created successfully'),
    onError: ({ message }) =>
      toast.error('Failed to create category', { description: message }),
  })

  const form = useForm({
    defaultValues: {
      parentId: undefined,
      name: '',
      description: undefined,
      image: undefined,
    } as CategoryValidators.CreateInput,
    schema: CategoryValidators.createInput,
    onSubmit: mutateAsync,
    onSuccess: () => void navigate('/admin/categories'),
  })

  return (
    <Card render={<form onSubmit={form.handleSubmit} />}>
      <FieldSet className='px-4'>
        <FieldLegend>Create New Category</FieldLegend>
        <FieldDescription>
          Use the form below to create a new category in the system.
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
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={meta.fieldId}>Description</FieldLabel>
                <Textarea {...field} placeholder='Category Description' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='image'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={meta.fieldId}>Image URL</FieldLabel>
                <Input {...field} placeholder='https://example.com/image.jpg' />
                <FieldDescription id={meta.descriptionId}>
                  URL of the category image. Will be replaced with upload
                  dropzone later.
                </FieldDescription>
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='parentId'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={meta.fieldId}>Parent Category</FieldLabel>
                <Select {...field}>
                  <SelectOption value='no-parent'>No Parent</SelectOption>
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

          <Field>
            <Button type='submit' disabled={form.state.isPending}>
              {form.state.isPending ? 'Creating...' : 'Create Category'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </Card>
  )
}
