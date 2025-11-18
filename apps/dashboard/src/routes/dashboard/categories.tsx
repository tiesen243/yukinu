import * as React from 'react'
import { useMutation } from '@tanstack/react-query'

import { Button } from '@yukinu/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@yukinu/ui/dialog'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { CategoryModels } from '@yukinu/validators/category'

import { CategoryTable } from '@/components/tables/category-table'
import { createMetadata } from '@/lib/metadata'
import { useTRPC } from '@/trpc/react'

export default function DashboardCategoriesIndex() {
  return (
    <main className='container py-4'>
      <div className='mb-2 flex items-center justify-between'>
        <h1 className='text-3xl font-extrabold'>Category Management</h1>
        <CreateCategoryButton />
      </div>

      <p className='mb-4 text-muted-foreground'>
        View and manage all categories in your application.
      </p>

      <section className='rounded-lg bg-card p-4 shadow'>
        <CategoryTable />
      </section>
    </main>
  )
}

export const meta = () =>
  createMetadata({
    title: 'Category Management',
    description: 'View and manage all categories in your application.',
  })

const CreateCategoryButton: React.FC = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Category</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            {/* Form fields for creating a new category would go here */}
            This is where the form to create a new category would be.
          </DialogDescription>
        </DialogHeader>

        <CreateCategoryForm
          close={() => {
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

const CreateCategoryForm: React.FC<{
  close: () => void
}> = ({ close }) => {
  const trpc = useTRPC()
  const { mutateAsync } = useMutation({
    ...trpc.category.create.mutationOptions(),
    meta: { filter: trpc.category.all.queryFilter() },
  })

  const form = useForm({
    defaultValues: { name: '' },
    schema: CategoryModels.createInput,
    onSubmit: mutateAsync,
    onSuccess: () => {
      close()
    },
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <FieldSet>
        <legend className='sr-only'>Create Category</legend>

        <FieldGroup>
          <form.Field
            name='name'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel>Name</FieldLabel>
                <Input {...field} placeholder='Category Name' />
                <FieldError errors={meta.errors} />
              </Field>
            )}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='secondary'>
                Cancel
              </Button>
            </DialogClose>

            <Button type='submit' disabled={form.state.isPending}>
              {form.state.isPending ? 'Creating...' : 'Create Category'}
            </Button>
          </DialogFooter>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
