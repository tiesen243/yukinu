import { Navigate, Outlet } from 'react-router'

import { useSession } from '@yukinu/auth/react'
import { Separator } from '@yukinu/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@yukinu/ui/sidebar'

import { AppSidebar } from '@/components/app-sidebar'
import { Breadcrumb } from '@/components/breadcrumb'

export default function DashboardLayout() {
  const { status } = useSession()
  if (status === 'unauthenticated') return <Navigate to='/login' replace />

  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />

      <SidebarInset>
        <header className='flex h-14 shrink-0 items-center gap-4 border-b px-4'>
          <SidebarTrigger />
          <Separator
            orientation='vertical'
            className='data-[orientation=vertical]:h-6'
          />
          <Breadcrumb />
        </header>
        <main className='flex-1 overflow-y-auto p-4'>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
