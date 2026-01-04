import { useSession } from '@yukinu/auth/react'
import { Separator } from '@yukinu/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@yukinu/ui/sidebar'
import { Navigate, Outlet } from 'react-router'

import { AppSidebar } from '@/components/app-sidebar'
import { Breadcrumb } from '@/components/breadcrumb'

export default function DashboardLayout() {
  const { status } = useSession()
  if (status === 'unauthenticated') return <Navigate to='/login' replace />

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant='inset' />

      <SidebarInset>
        <header className='sticky inset-0 flex h-(--header-height) shrink-0 items-center gap-2 border-b backdrop-blur-xl backdrop-saturate-150 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) md:relative'>
          <div className='flex w-full items-center gap-1 px-4 lg:gap-2'>
            <SidebarTrigger />
            <Separator
              orientation='vertical'
              className='data-[orientation=vertical]:h-6'
            />
            <Breadcrumb />
          </div>
        </header>

        <main className='flex-1 flex flex-col p-4'>
          <h1 className='sr-only'>Dashboard Content</h1>

          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
