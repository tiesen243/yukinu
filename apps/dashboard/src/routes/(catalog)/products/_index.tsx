import { useQuery } from '@tanstack/react-query'
import { formatPrice } from '@yukinu/lib/utils'
import { Button } from '@yukinu/ui/button'
import { Typography } from '@yukinu/ui/typography'
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from 'nuqs'
import { Link } from 'react-router'

import { DataTable } from '@/components/data-table'
import { userContext } from '@/lib/context'
import { useTRPC } from '@/lib/trpc'
import { ProductButton } from '@/routes/(catalog)/products/_components/product-button'
import { ProductSearchForm } from '@/routes/(catalog)/products/_components/search-form'

import type { Route } from './+types/_index'

export const loader = ({ context }: Route.LoaderArgs) => {
  const user = context.get(userContext)
  return { isAdmin: ['admin', 'moderator'].includes(user?.role ?? '') }
}

export default function CatalogProductsIndexPage({
  loaderData,
}: Route.ComponentProps) {
  const { trpc } = useTRPC()
  const [query, setQuery] = useQueryStates({
    search: parseAsString.withDefault(''),
    isDeleted: parseAsBoolean.withDefault(false),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  })

  const { data, isLoading } = useQuery(
    loaderData.isAdmin
      ? trpc.catalog.product.all.queryOptions(query)
      : trpc.catalog.product.allByVendor.queryOptions(query),
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
          <div className='flex items-center gap-2'>
            <ProductSearchForm
              onSearch={({ search }) => setQuery({ search, page: 1 })}
            />

            <Button
              nativeButton={false}
              render={<Link to='/catalog/products/new' />}
            >
              Create Product
            </Button>
            <Button
              variant='outline'
              onClick={() => setQuery({ isDeleted: !query.isDeleted, page: 1 })}
            >
              {query.isDeleted
                ? 'Show Active Products'
                : 'Show Deleted Products'}
            </Button>
          </div>
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
        actions={(item) => (
          <div className='flex items-center gap-2'>
            {item.deletedAt ? (
              <ProductButton
                productId={item.id}
                productName={item.name}
                type='restore'
                variant='default'
                isAdmin={loaderData.isAdmin}
              />
            ) : (
              <Button
                nativeButton={false}
                render={<Link to={`/catalog/products/${item.id}`} />}
              >
                Edit
              </Button>
            )}

            {item.deletedAt ? (
              <ProductButton
                productId={item.id}
                productName={item.name}
                type='permanentDelete'
                variant='destructive'
                isAdmin={loaderData.isAdmin}
              />
            ) : (
              <ProductButton
                productId={item.id}
                productName={item.name}
                type='delete'
                variant='destructive'
                isAdmin={loaderData.isAdmin}
              />
            )}
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
