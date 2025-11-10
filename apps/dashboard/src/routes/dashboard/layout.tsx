import { Outlet, redirect } from 'react-router'

import { auth } from '@yukinu/auth'
import { SidebarInset, SidebarProvider } from '@yukinu/ui/sidebar'

import type { Route } from './+types/layout'
import { AppSidebar } from '@/components/app-sidebar'
import { Header } from '@/components/header'

export const loader = async ({ request }: Route.LoaderArgs) => {
  const cookieHeader = request.headers.get('Cookie') ?? ''

  const session = await auth(request)
  if (!session.user) return redirect(new URL(request.url).origin)

  const sidebarState = cookieHeader
    .split('; ')
    .find((cookie) => cookie.startsWith('sidebar_state='))

  return {
    sidebarState: sidebarState === 'sidebar_state=true',
  }
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  return (
    <SidebarProvider
      defaultOpen={loaderData.sidebarState}
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant='inset' />
      <SidebarInset>
        <Header />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
