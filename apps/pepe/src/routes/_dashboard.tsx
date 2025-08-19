import type { Route } from '@react-router/types/_dashboard'
import { Outlet, redirect } from 'react-router'

import { auth } from '@yuki/auth'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@yuki/ui/sidebar'

import { Breadcrumb } from '@/components/breadcrumb'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { ThemeToggle } from '@/components/theme-toggle'

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await auth({ headers: request.headers })
  if (!session.user) return redirect('/login')
  if (session.user.role === 'user') return redirect('/deny')

  if (session.user.role !== 'admin' && request.url.includes('/admin'))
    return redirect('/')

  const cookieHeader = request.headers.get('cookie')
  const sidebarState = cookieHeader
    ? cookieHeader
        .split('; ')
        .find((row) => row.startsWith('sidebar_state='))
        ?.split('=')[1]
    : null

  return { sidebarState: sidebarState === 'true', user: session.user }
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  return (
    <SidebarProvider defaultOpen={loaderData.sidebarState}>
      <DashboardSidebar user={loaderData.user} />

      <SidebarInset>
        <header className='flex h-12 items-center gap-4 border-b border-sidebar-border bg-sidebar px-4'>
          <SidebarTrigger />
          <Breadcrumb />
          <ThemeToggle />
        </header>

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
