import { ProductTable } from '@/components/tables/product-table'
import { createMetadata } from '@/lib/metadata'

export default function DashboardProductsIndex() {
  return (
    <main className='container py-4'>
      <h1 className='mb-2 text-3xl font-extrabold'>Product Management</h1>
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
