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
import { Typography } from '@yukinu/ui/typography'
import { Link } from 'react-router'

import { CategoriesList } from '@/routes/admin/categories/categories-list'
import { CategoriesPagination } from '@/routes/admin/categories/categories-pagination'
import { SearchForm } from '@/routes/admin/categories/search-form'

export default function CategoriesPage() {
  return (
    <>
      <Typography variant='h2'>Categories Management</Typography>
      <Typography className='text-muted-foreground'>
        Manage and view all categories in the system.
      </Typography>

      <div className='my-4 flex items-center justify-between gap-4'>
        <SearchForm />

        <div className='flex-1' />

        <Button
          variant='outline'
          render={
            <Link to='/admin/categories/new'>
              <PlusIcon />
              <span className='sr-only md:not-sr-only'>Add</span>
            </Link>
          }
        />

        <Button variant='outline' disabled>
          <DownloadIcon />
          <span className='sr-only md:not-sr-only'>Export</span>
        </Button>
      </div>

      <Card className='px-6' render={<section />}>
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
      </Card>
    </>
  )
}
