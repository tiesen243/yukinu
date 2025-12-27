import { useQuery } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import { ChevronLeftIcon } from '@yukinu/ui/icons'

import { useTRPC } from '@/lib/trpc/react'
import { useCategoryQueryStates } from '@/routes/admin/categories/hook'

export const CategoriesPagination: React.FC = () => {
  const trpc = useTRPC()
  const [query, setQuery] = useCategoryQueryStates()

  const { data, isLoading } = useQuery(trpc.category.all.queryOptions(query))

  if (isLoading || !data?.pagination) return

  return (
    <nav className='mt-4 flex items-center justify-center gap-4'>
      <Button
        variant='outline'
        size='icon'
        disabled={data.pagination.page === 1}
        onClick={() =>
          setQuery((prev) => ({
            ...prev,
            page: data.pagination.page - 1,
          }))
        }
      >
        <ChevronLeftIcon />
        <span className='sr-only'>Previous Page</span>
      </Button>

      <span className='text-sm text-muted-foreground'>
        Page {data.pagination.page} of {data.pagination.totalPages}
      </span>

      <Button
        variant='outline'
        size='icon'
        disabled={
          data.pagination.page === data.pagination.totalPages ||
          data.pagination.totalPages === 0
        }
        onClick={() =>
          setQuery((prev) => ({
            ...prev,
            page: data.pagination.page + 1,
          }))
        }
      >
        <ChevronLeftIcon className='rotate-180' />
        <span className='sr-only'>Next Page</span>
      </Button>
    </nav>
  )
}
