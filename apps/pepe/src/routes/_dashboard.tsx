import { Outlet, useNavigate } from 'react-router'

import { useSession } from '@yuki/auth/react'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@yuki/ui/sidebar'

import type { Route } from './+types/_dashboard'
import { Breadcrumb } from '@/components/breadcrumb'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { ThemeToggle } from '@/components/theme-toggle'

export const loader = ({ request }: Route.LoaderArgs) => {
  const cookieHeader = request.headers.get('cookie')
  const sidebarState = cookieHeader
    ? cookieHeader
        .split('; ')
        .find((row) => row.startsWith('sidebar_state='))
        ?.split('=')[1]
    : null

  return { sidebarState: sidebarState === 'true' }
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const { session, status } = useSession()
  const navigate = useNavigate()

  if (status === 'loading')
    return (
      <main className='flex min-h-dvh flex-col items-center justify-center gap-4'>
        <div className='flex flex-col items-center gap-4'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
          <p className='text-sm text-muted-foreground'>Loading...</p>
        </div>
      </main>
    )
  else if (status === 'unauthenticated') return navigate('/login')
  else if (session.user.role === 'user') return navigate('/deny')

  return (
    <SidebarProvider defaultOpen={loaderData.sidebarState}>
      <DashboardSidebar user={session.user} />

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
