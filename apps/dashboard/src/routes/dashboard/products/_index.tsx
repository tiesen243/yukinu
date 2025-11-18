import { Link } from 'react-router'

import { useSession } from '@yukinu/auth/react'
import { Button } from '@yukinu/ui/button'

import { ProductTable } from '@/components/tables/product-table'
import { createMetadata } from '@/lib/metadata'

export default function DashboardProductsIndex() {
  const { session } = useSession()

  return (
    <main className='container py-4'>
      <div className='mb-2 flex items-center justify-between'>
        <h1 className='text-3xl font-extrabold'>Product Management</h1>

        {['vendor_owner', 'vendor_staff'].includes(
          session.user?.role ?? '',
        ) && (
          <Button size='sm' asChild>
            <Link to='/products/create'>Add New Product</Link>
          </Button>
        )}
      </div>

      <p className='mb-4 text-muted-foreground'>
        Manage and oversee all products listed in your e-commerce store.
      </p>

      <section className='rounded-lg bg-card p-4 shadow'>
        <ProductTable />
      </section>
    </main>
  )
}

export const meta = () =>
  createMetadata({
    title: 'Product Management',
    description:
      'Manage and oversee all products listed in your e-commerce store.',
  })
