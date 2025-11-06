import { VendorTable } from '@/components/tables/vendor-table'

export default function DashboardVendorsPage() {
  return (
    <main className='container py-4'>
      <h1 className='mb-2 text-3xl font-extrabold'>Vendors Management</h1>
      <p className='mb-4 text-muted-foreground'>
        View and manage all registered vendors in your application.
      </p>

      <section className='rounded-lg bg-card p-4 shadow'>
        <VendorTable />
      </section>
    </main>
  )
}
