import { useQuery } from '@tanstack/react-query'
import { Button } from '@yukinu/ui/button'
import { Typography } from '@yukinu/ui/typography'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { Link } from 'react-router'

import { DataTable } from '@/components/data-table'
import { useTRPC } from '@/lib/trpc'
import { DeleteCategoryButton } from '@/routes/(catalog)/categories/_components/delete-category-button'
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
          <div className='flex items-center justify-between'>
            <CategorySearchForm
              onSearch={({ search }) => setQuery({ search, page: 1 })}
            />

            <Button
              nativeButton={false}
              render={<Link to='/catalog/categories/new' />}
            >
              Create Category
            </Button>
          </div>
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
        actions={(item) => (
          <div className='flex items-center gap-2'>
            <Button
              nativeButton={false}
              render={<Link to={`/catalog/categories/${item.id}`} />}
            >
              Edit
            </Button>
            <DeleteCategoryButton
              categoryId={item.id}
              categoryName={item.name}
            />
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
