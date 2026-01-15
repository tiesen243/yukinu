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
  createCategoryInput,
  type CreateCategoryInput,
} from '@yukinu/validators/general'
import { useNavigate } from 'react-router'

import { InputGroupUploadButton } from '@/components/input-group-upload-button'
import { useTRPC } from '@/lib/trpc/react'

export default function CategoriesNewPage() {
  const trpc = useTRPC()
  const navigate = useNavigate()

  const { data } = useQuery(
    trpc.category.all.queryOptions({ search: '', limit: 100 }),
  )

  const { mutateAsync } = useMutation({
    ...trpc.category.create.mutationOptions(),
    meta: { filter: trpc.category.all.queryFilter() },
    onSuccess: () => toast.success('Category created successfully'),
    onError: ({ message }) =>
      toast.error('Failed to create category', { description: message }),
  })

  const { formId, FormField, handleSubmit, state } = useForm({
    defaultValues: {
      parentId: null,
      name: '',
      description: '',
      image: null,
    } as CreateCategoryInput,
    schema: createCategoryInput,
    onSubmit: mutateAsync,
    onSuccess: () => void navigate('/admin/categories'),
  })

  return (
    <Card id={formId} render={<form onSubmit={handleSubmit} />}>
      <FieldSet className='px-6'>
        <FieldLegend>Create New Category</FieldLegend>
        <FieldDescription>
          Use the form below to create a new category in the system.
        </FieldDescription>

        <FieldGroup>
          <FormField
            name='name'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Name</FieldLabel>
                <Input {...field} placeholder='Category Name' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <FormField
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

          <FormField
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

          <FormField
            name='parentId'
            render={({ meta, field: { value, ...field } }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Parent Category</FieldLabel>
                <NativeSelect {...field} value={value ?? ''}>
                  <NativeSelectOption value='' disabled>
                    No Parent
                  </NativeSelectOption>
                  {data?.categories.map((category) => (
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
            <Button type='submit' disabled={state.isPending}>
              {state.isPending ? 'Creating...' : 'Create Category'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </Card>
  )
}
