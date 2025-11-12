import { Outlet, redirect } from 'react-router'

import { auth } from '@yukinu/auth'
import { SessionProvider } from '@yukinu/auth/react'
import { SidebarInset, SidebarProvider } from '@yukinu/ui/sidebar'

import type { Route } from './+types/layout'
import { AppSidebar } from '@/components/app-sidebar'
import { Header } from '@/components/header'
import { getBaseUrl } from '@/lib/utils'

export const loader = async ({ request }: Route.LoaderArgs) => {
  const cookieHeader = request.headers.get('Cookie') ?? ''

  const session = await auth(request)
  if (!session.user) return redirect(getBaseUrl())

  const sidebarState = cookieHeader
    .split('; ')
    .find((cookie) => cookie.startsWith('sidebar_state='))

  return {
    session,
    sidebarState: sidebarState === 'sidebar_state=true',
  }
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const { session, sidebarState } = loaderData

  return (
    <SessionProvider base='/dashboard/api/auth' session={session}>
      <SidebarProvider
        defaultOpen={sidebarState}
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
    </SessionProvider>
  )
}
