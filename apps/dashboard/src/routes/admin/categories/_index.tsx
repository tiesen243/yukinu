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

import { CategoriesList } from '@/routes/admin/categories/categories-list'
import { CategoriesPagination } from '@/routes/admin/categories/categories-pagination'
import { SearchForm } from '@/routes/admin/categories/search-form'

export default function CategoriesPage() {
  return (
    <>
      <h1 className='text-3xl font-bold'>Categories Management</h1>
      <p className='mt-2 text-muted-foreground'>
        Manage and view all categories in the system.
      </p>

      <div className='my-6 flex items-center justify-between gap-4'>
        <SearchForm />

        <div className='flex-1' />

        <Button variant='outline' asChild>
          <Link to='/admin/categories/new'>
            <PlusIcon />
            <span className='sr-only md:not-sr-only'>Add</span>
          </Link>
        </Button>

        <Button variant='outline' disabled>
          <DownloadIcon />
          <span className='sr-only md:not-sr-only'>Export</span>
        </Button>
      </div>

      <section className='rounded-lg bg-card p-6 text-card-foreground shadow-sm dark:border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <CategoriesList />
          </TableBody>
        </Table>

        <CategoriesPagination />
      </section>
    </>
  )
}
