import { useMutation, useQuery } from '@tanstack/react-query'
import type { AllCategoriesDto } from '@yukinu/api/catalog'
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
import { TableCell, TableRow } from '@yukinu/ui/table'
import { toast } from '@yukinu/ui/toast'
import { useState } from 'react'
import { Link } from 'react-router'

import { useTRPC } from '@/lib/trpc/react'
import { useCategoryQueryStates } from '@/routes/admin/categories/_components/hook'

export const CategoriesList: React.FC = () => {
  const { trpc } = useTRPC()
  const [query] = useCategoryQueryStates()

  const { data, isLoading } = useQuery(
    trpc.catalog.category.all.queryOptions(query),
  )

  if (isLoading)
    return Array.from({ length: 5 }, (_, index) => (
      <TableRow key={index}>
        {Array.from({ length: 4 }, (__, cellIndex) => (
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
      <TableCell>{category.parentId}</TableCell>
      <TableCell className='space-x-2'>
        <Link
          to={`/admin/categories/${category.id}`}
          className='text-primary underline-offset-4 hover:underline'
        >
          Edit
        </Link>
        <DeleteCategoryButton category={category} />
      </TableCell>
    </TableRow>
  ))
}

const DeleteCategoryButton: React.FC<{
  category: AllCategoriesDto.Output['categories'][number]
}> = ({ category }) => {
  const { trpc } = useTRPC()
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    ...trpc.catalog.category.delete.mutationOptions(),
    onSuccess: () => {
      toast.add({
        type: 'success',
        title: 'Category deleted successfully',
      })
      setOpen(false)
    },
    onError: ({ message }) =>
      toast.add({
        type: 'error',
        title: 'Failed to delete category',
        description: message,
      }),
    meta: { filter: trpc.catalog.category.all.queryFilter() },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant='link' className='text-destructive' />}
      >
        Delete
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the category &quot;{category.name}
            &quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose disabled={isPending}>Cancel</DialogClose>
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
