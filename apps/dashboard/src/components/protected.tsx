import { useSession } from '@yukinu/auth/react'
import { Loader2Icon } from '@yukinu/ui/icons'
import { ScrollArea } from '@yukinu/ui/scroll-area'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@yukinu/ui/sidebar'
import { Navigate, Outlet } from 'react-router'

import { AppSidebar } from '@/components/app-sidebar'
import { Breadcrumbs } from '@/components/breadcrumbs'

export default function Protected() {
  const { status, user } = useSession()

  if (status === 'loading')
    return (
      <main className='flex h-dvh animate-pulse flex-col items-center justify-center gap-4'>
        <Loader2Icon className='size-8 animate-spin' />
        <span className='sr-only'>Loading...</span>
      </main>
    )

  if (status === 'unauthenticated') return <Navigate to='/login' replace />

  if (user.role === 'user') return <Navigate to='/register-vendor' replace />

  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />

      <SidebarInset className='overflow-x-hidden'>
        <h1 className='sr-only'>Dashboard</h1>

        <header className='flex h-14 shrink-0 items-center gap-2 border-b bg-background/70 px-4'>
          <SidebarTrigger />
          <hr className='h-4 border-l' />
          <Breadcrumbs />
        </header>

        <ScrollArea
          className='h-[calc(100dvh-3.5rem)] px-4 md:h-[calc(100dvh-4.5rem)] [&_h2]:mb-0'
          render={<section />}
        >
          <Outlet />
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  )
}
