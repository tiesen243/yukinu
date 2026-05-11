import { currentUser } from '@yukinu/auth'
import { ScrollArea } from '@yukinu/ui/scroll-area'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@yukinu/ui/sidebar'
import { Outlet, redirect } from 'react-router'

import { AppSidebar } from '@/components/app-sidebar'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { SearchBox } from '@/components/search-box'
import { userContext } from '@/lib/context'

import type { Route } from './+types/protected'

const authMiddleware: Route.MiddlewareFunction = async ({
  context,
  request,
}) => {
  const user = await currentUser(request)
  if (!user) throw redirect('/login')
  context.set(userContext, user)
}

export const middleware: Route.MiddlewareFunction[] = [authMiddleware]

export const loader = ({ context }: Route.LoaderArgs) => {
  const user = context.get(userContext)
  if (user?.role === 'user') throw redirect('/register-vendor')
}

export default function Protected(_: Route.ComponentProps) {
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
