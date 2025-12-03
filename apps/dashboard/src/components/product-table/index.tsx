import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@yukinu/ui/table'

import { ProductsList } from '@/components/product-table/products-list'
import { ProductsPagination } from '@/components/product-table/products-pagination'
import {
  SearchForm,
  ToggleProductStatusButton,
} from '@/components/product-table/search-form'

export function ProductTable({ isAdmin }: { isAdmin?: boolean }) {
  return (
    <>
      <div className='flex items-center justify-between'>
        <SearchForm />
        <ToggleProductStatusButton />
      </div>

      <section className='rounded-lg bg-card p-6 text-card-foreground shadow-sm'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Min Price</TableHead>
              <TableHead>Max Price</TableHead>
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
