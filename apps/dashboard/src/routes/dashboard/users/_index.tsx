import { UserTable } from '@/components/tables/user-table'

export default function DashboardUsersIndex() {
  return (
    <main className='container py-4'>
      <h1 className='mb-2 text-3xl font-extrabold'>User Management</h1>
      <p className='mb-4 text-muted-foreground'>
        View and manage all registered users in your application.
      </p>

      <section className='rounded-lg bg-card p-4 shadow'>
        <UserTable />
      </section>
    </main>
  )
}
