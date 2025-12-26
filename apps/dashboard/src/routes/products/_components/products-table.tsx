import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
import { DownloadIcon, PlusIcon } from '@yukinu/ui/icons'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'
import { Link } from 'react-router'

import { ProductsList } from '@/routes/products/_components/products-list'
import { ProductsPagination } from '@/routes/products/_components/products-pagination'
import {
  SearchForm,
  ToggleProductStatusButton,
} from '@/routes/products/_components/search-form'
import { useProductQueryStates } from '@/routes/products/_hook'

export function ProductTable({ isAdmin }: { isAdmin?: boolean }) {
  const [query] = useProductQueryStates()

  return (
    <>
      <div className='my-4 flex items-center justify-between gap-4'>
        <SearchForm />

        <div className='flex-1' />

        {!isAdmin && (
          <Button
            variant='outline'
            nativeButton={false}
            render={
              <Link to='/products/new'>
                <PlusIcon />
                <span className='sr-only md:not-sr-only'>Add Product</span>
              </Link>
            }
          />
        )}

        <ToggleProductStatusButton />

        <Button variant='outline' disabled>
          <DownloadIcon />
          <span className='sr-only md:not-sr-only'>Export</span>
        </Button>
      </div>

      <Card render={<section className='px-4' />}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>
                {query.isDeleted ? 'Deleted At' : 'Updated At'}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <ProductsList isAdmin={isAdmin} />
          </TableBody>
        </Table>

        <ProductsPagination isAdmin={isAdmin} />
      </Card>
    </>
  )
}
