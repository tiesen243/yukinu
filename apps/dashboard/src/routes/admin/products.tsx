import { ProductTable } from '@/components/product-table'

export default function AdminProductsPage() {
  return (
    <>
      <h1 className='text-3xl font-bold'>Products Management</h1>
      <p className='mt-2 text-muted-foreground'>
        Manage and view all products in your organization from this dashboard.
      </p>

      <ProductTable isAdmin />
    </>
  )
}
