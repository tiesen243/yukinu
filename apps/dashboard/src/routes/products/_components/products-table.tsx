import { Link } from 'react-router'

import { Button } from '@yukinu/ui/button'
import { DownloadIcon, PlusIcon } from '@yukinu/ui/icons'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'

import { ProductsList } from '@/routes/products/_components/products-list'
import { ProductsPagination } from '@/routes/products/_components/products-pagination'
import {
  SearchForm,
  ToggleProductStatusButton,
} from '@/routes/products/_components/search-form'

export function ProductTable({ isAdmin }: { isAdmin?: boolean }) {
  return (
    <>
      <div className='my-6 flex items-center justify-between gap-4'>
        <SearchForm />

        <div className='flex-1' />

        {!isAdmin && (
          <Button variant='outline' asChild>
            <Link to='/products/new'>
              <PlusIcon />
              <span className='sr-only md:not-sr-only'>Add Product</span>
            </Link>
          </Button>
        )}

        <ToggleProductStatusButton />

        <Button variant='outline' disabled>
          <DownloadIcon />
          <span className='sr-only md:not-sr-only'>Export</span>
        </Button>
      </div>

      <section className='rounded-lg bg-card p-6 text-card-foreground shadow-sm'>
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
              <TableHead>Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <ProductsList isAdmin={isAdmin} />
          </TableBody>
        </Table>

        <ProductsPagination isAdmin={isAdmin} />
      </section>
    </>
  )
}
