import { useQuery } from '@tanstack/react-query'
import { useSession } from '@yukinu/auth/react'
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
import { useTRPC } from '@/lib/trpc'
import { ProductButton } from '@/routes/catalog/products/_components/product-button'
import { ProductSearchForm } from '@/routes/catalog/products/_components/search-form'

export default function CatalogProductsIndexPage() {
  const { status, user } = useSession()

  if (status !== 'authenticated') return null
  return (
    <CatalogProductsIndexPageContent
      isAdmin={['admin', 'moderator'].includes(user.role)}
    />
  )
}

const CatalogProductsIndexPageContent: React.FC<{ isAdmin: boolean }> = ({
  isAdmin,
}) => {
  const { trpc } = useTRPC()
  const [query, setQuery] = useQueryStates({
    search: parseAsString.withDefault(''),
    isDeleted: parseAsBoolean.withDefault(false),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  })

  const queryParams = { ...query, categoryId: null, vendorId: null }
  const { data, isLoading } = useQuery(
    isAdmin
      ? trpc.catalog.product.all.queryOptions(queryParams)
      : trpc.catalog.product.allByVendor.queryOptions(queryParams),
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

            {!isAdmin && (
              <Button
                nativeButton={false}
                render={<Link to='/catalog/products/new' />}
              >
                Create Product
              </Button>
            )}

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
                isAdmin={isAdmin}
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
                isAdmin={isAdmin}
              />
            ) : (
              <ProductButton
                productId={item.id}
                productName={item.name}
                type='delete'
                variant='destructive'
                isAdmin={isAdmin}
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
