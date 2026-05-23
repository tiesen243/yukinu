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
import { SearchBox } from '@/components/search-box'

import type { Route } from './+types/protected'

export default function Protected(_: Route.ComponentProps) {
  const { status, user } = useSession()

  if (status === 'loading')
    return (
      <div className='grid min-h-dvh place-items-center'>
        <Loader2Icon className='animate-spin' />
      </div>
    )

  if (status === 'unauthenticated') return <Navigate to='/login' replace />

  if (status === 'authenticated' && user.role === 'user')
    return <Navigate to='/register-vendor' replace />

  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />

      <SidebarInset className='overflow-x-hidden'>
        <h1 className='sr-only'>Dashboard</h1>

        <header className='flex h-14 shrink-0 items-center gap-2 border-b bg-background/70 px-4'>
          <SidebarTrigger />
          <hr className='h-4 border-l' />
          <Breadcrumbs />

          <SearchBox />
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
