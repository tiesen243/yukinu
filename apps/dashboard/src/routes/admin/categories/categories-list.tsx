import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'

import type { CategoryValidators } from '@yukinu/validators/category'
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
import { toast } from '@yukinu/ui/sonner'
import { TableCell, TableRow } from '@yukinu/ui/table'

import { useTRPC } from '@/lib/trpc/react'
import { useCategoryQueryStates } from '@/routes/admin/categories/hook'

export const CategoriesList: React.FC = () => {
  const trpc = useTRPC()
  const [query] = useCategoryQueryStates()

  const { data, isLoading } = useQuery(trpc.category.all.queryOptions(query))

  if (isLoading)
    return Array.from({ length: 5 }, (_, index) => (
      <TableRow key={index}>
        {Array.from({ length: 4 }, (_, cellIndex) => (
          <TableCell key={cellIndex}>
            <div className='animate-pulse rounded bg-muted/50'>&nbsp;</div>
          </TableCell>
        ))}
      </TableRow>
    ))

  return data?.categories.map((category) => (
    <TableRow key={category.id}>
      <TableCell>{category.id}</TableCell>
      <TableCell>{category.name}</TableCell>
      <TableCell>{category.parent?.name}</TableCell>
      <TableCell className='space-x-2'>
        <Link
          to={`/admin/categories/${category.id}`}
          className='text-primary underline-offset-4 hover:underline'
        >
          Edit
        </Link>
        <DeleteVendorButton category={category} />
      </TableCell>
    </TableRow>
  ))
}

const DeleteVendorButton: React.FC<{
  category: CategoryValidators.AllOutput['categories'][number]
}> = ({ category }) => {
  const trpc = useTRPC()
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    ...trpc.category.delete.mutationOptions(),
    onSuccess: () => {
      toast.success('Category updated successfully')
      setOpen(false)
    },
    onError: ({ message }) =>
      toast.error('Failed to update category', { description: message }),
    meta: { filter: trpc.vendor.all.queryFilter() },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='text-destructive underline-offset-4 hover:underline'>
        Delete
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the category "{category.name}"? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            variant='destructive'
            disabled={isPending}
            onClick={() => {
              mutate({ id: category.id })
            }}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
