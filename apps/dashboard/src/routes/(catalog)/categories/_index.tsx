import { useQuery } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import { Typography } from '@yukinu/ui/typography'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

import { DataTable } from '@/components/data-table'
import { useTRPC } from '@/lib/trpc'
import { CategorySearchForm } from '@/routes/(catalog)/categories/_components/search-form'

export default function CatalogCategoriesIndexPage() {
  const { trpc } = useTRPC()
  const [query, setQuery] = useQueryStates({
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  })

  const { data, isLoading } = useQuery(
    trpc.catalog.category.all.queryOptions(query),
  )

  return (
    <>
      <Typography variant='h2'>Categories</Typography>
      <Typography className='text-muted-foreground'>
        Manage and view all catalog categories. Create, edit, and organize
        hierarchical categories to structure your products effectively.
      </Typography>

      <DataTable
        header={
          <CategorySearchForm
            onSearch={({ search }) => setQuery({ search, page: 1 })}
          />
        }
        data={data?.categories ?? []}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        columns={{
          id: 'ID',
          name: 'Name',
          parent: {
            label: 'Parent Category',
            render: (value) => value?.name,
          },
        }}
        actions={() => (
          <div className='flex items-center gap-2'>
            <Button>Edit</Button>
            <Button variant='destructive'>Delete</Button>
          </div>
        )}
        pagination={{
          ...data?.pagination,
          setPage: (page) => setQuery({ page }),
        }}
      />
    </>
  )
}
