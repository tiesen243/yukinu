import { useQuery } from '@tanstack/react-query'
import { formatPrice } from '@yukinu/lib/utils'
import { Button } from '@yukinu/ui/button'
import { Typography } from '@yukinu/ui/typography'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

import { DataTable } from '@/components/data-table'
import { useTRPC } from '@/lib/trpc'
import { ProductSearchForm } from '@/routes/(catalog)/products/_components/search-form'

export default function CatalogProductsIndexPage() {
  const { trpc } = useTRPC()
  const [query, setQuery] = useQueryStates({
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  })

  const { data, isLoading } = useQuery(
    trpc.catalog.product.all.queryOptions(query),
  )

  return (
    <>
      <Typography variant='h2'>Products</Typography>
      <Typography className='text-muted-foreground'>
        Manage and view all catalog products. Create, edit, and organize
        products with detailed information, pricing, and inventory management.
      </Typography>

      <DataTable
        header={
          <ProductSearchForm
            onSearch={({ search }) => setQuery({ search, page: 1 })}
          />
        }
        data={data?.products ?? []}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        columns={{
          id: 'ID',
          name: 'Name',
          category: 'Category',
          price: { label: 'Price', render: (value) => formatPrice(value) },
          stock: 'Stock',
          sold: 'Sold',
          rating: 'Rating',
          createdAt: 'Created At',
          updatedAt: 'Updated At',
          deletedAt: 'Deleted At',
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
