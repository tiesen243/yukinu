//#region imports
import { Outlet, redirect } from 'react-router'

import { auth } from '@yukinu/auth'
import { SidebarInset, SidebarProvider } from '@yukinu/ui/sidebar'
import { env } from '@yukinu/validators/env.vite'

import type { Route } from './+types/_dashboard'
import { AppSidebar } from '@/components/app-sidebar'
import { Header } from '@/components/header'

//#endregion

export const loader = async ({ request }: Route.LoaderArgs) => {
  const cookieHeader = request.headers.get('Cookie') ?? ''

  const session = await auth(request)
  if (!session.user) {
    const protocal = env.NODE_ENV === 'production' ? 'https' : 'http'
    return redirect(
      `${protocal}://${env.VITE_WEB_URL}/login?redirect_to=${request.url}/api/auth/set-session`,
    )
  }

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
