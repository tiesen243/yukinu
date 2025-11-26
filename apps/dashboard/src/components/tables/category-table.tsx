import * as React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { parseAsInteger, useQueryStates } from 'nuqs'

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
import { Field, FieldError, FieldLabel, FieldSet } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { ChevronLeftIcon, ChevronRightIcon } from '@yukinu/ui/icons'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'
import { CategoryModels } from '@yukinu/validators/category'

import { useTRPC } from '@/trpc/react'

function useCategoryTable() {
  const trpc = useTRPC()

  const [query, setQuery] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  })

  const { data, isLoading } = useQuery(trpc.category.all.queryOptions(query))
  const { mutateAsync: update } = useMutation({
    ...trpc.category.update.mutationOptions(),
    onSuccess: () => toast.success('Category updated successfully'),
    onError: (error) => toast.error(error.message),
    meta: { filter: trpc.category.all.queryFilter() },
  })

  const { mutate: remove, isPending: isRemoving } = useMutation({
    ...trpc.category.delete.mutationOptions(),
    onSuccess: () => toast.success('Category deleted successfully'),
    onError: (error) => toast.error(error.message),
    meta: { filter: trpc.category.all.queryFilter() },
  })

  const handlePagination = React.useCallback(
    async (newPage: number) => setQuery({ ...query, page: newPage }),
    [query, setQuery],
  )

  return {
    query,
    data,
    isLoading,
    handlePagination,
    update,
    remove,
    isRemoving,
  }
}

export const CategoryTable: React.FC = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className='w-52'>ID</TableHead>
        <TableHead className='w-full'>Name</TableHead>
        <TableHead className='min-w-32'>Actions</TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      <CategoryTableBody />
    </TableBody>

    <TableFooter className='bg-transparent'>
      <CategoryTableFooter />
    </TableFooter>
  </Table>
)

const CategoryTableBody: React.FC = () => {
  const { query, data, isLoading } = useCategoryTable()

  if (isLoading)
    return Array.from({ length: query.limit }, (_, index) => (
      <TableRow key={index}>
        {Array.from({ length: 3 }, (_, index) => (
          <TableCell key={index}>
            <div className='animate-pulse rounded-sm bg-muted'>&nbsp;</div>
          </TableCell>
        ))}
      </TableRow>
    ))

  if (!data?.categories || data.categories.length === 0)
    return (
      <TableRow>
        <TableCell colSpan={3} className='text-center'>
          No categories found.
        </TableCell>
      </TableRow>
    )

  return data.categories.map((category) => (
    <TableRow key={category.id}>
      <TableCell>{category.id}</TableCell>
      <TableCell>{category.name}</TableCell>
      <TableCell className='flex w-fit items-center gap-2'>
        <EditCategoryModal category={category} />
        <DeleteCategoryModal category={category} />
      </TableCell>
    </TableRow>
  ))
}

const CategoryTableFooter: React.FC = () => {
  const { data, isLoading, handlePagination } = useCategoryTable()
  if (isLoading || !data?.pagination) return null

  const { page, totalPages } = data.pagination

  return (
    <TableRow>
      <TableCell colSpan={3}>
        <div className='flex items-center justify-end gap-4'>
          <Button
            variant='outline'
            size='sm'
            disabled={page <= 1}
            onClick={() => handlePagination(page - 1)}
          >
            <ChevronLeftIcon />
            <span className='sr-only'>Previous</span>
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            variant='outline'
            size='sm'
            disabled={page >= totalPages}
            onClick={() => handlePagination(page + 1)}
          >
            <ChevronRightIcon />
            <span className='sr-only'>Next</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

const EditCategoryModal: React.FC<{
  category: CategoryModels.AllOutput['categories'][number]
}> = ({ category }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { update } = useCategoryTable()

  const form = useForm({
    defaultValues: category,
    schema: CategoryModels.updateInput,
    onSubmit: update,
    onSuccess: () => {
      setIsOpen(false)
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category #{category.id}</DialogTitle>
          <DialogDescription>
            Modify the details of the category and save your changes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit}>
          <FieldSet>
            <form.Field
              name='name'
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel htmlFor={meta.fieldId}>Name</FieldLabel>
                  <Input {...field} />
                  <FieldError id={meta.errorId} errors={meta.errors} />
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
                Save Changes
              </Button>
            </DialogFooter>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export const DeleteCategoryModal: React.FC<{
  category: CategoryModels.AllOutput['categories'][number]
}> = ({ category }) => {
  const { remove, isRemoving } = useCategoryTable()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='destructive' size='sm'>
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category: {category.name}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this category? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='secondary'>Cancel</Button>
          </DialogClose>
          <Button
            variant='destructive'
            onClick={() => {
              remove(category)
            }}
            disabled={isRemoving}
          >
            {isRemoving ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
