import type { Route } from './+types/_index'

export default function DashboardIndex(_: Route.ComponentProps) {
  return (
    <main className='container py-4'>
      <h1>Welcome to the Dashboard</h1>
      <p>
        This is the main dashboard page. Use the sidebar to navigate through
        different sections.
      </p>
    </main>
  )
}
