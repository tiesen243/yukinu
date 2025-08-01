import { Form, Link, useLocation } from 'react-router'

import type { User } from '@yuki/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@yuki/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@yuki/ui/dropdown-menu'
import {
  HomeIcon,
  LayoutDashboardIcon,
  LineChartIcon,
  LogOutIcon,
  PackageIcon,
  Settings,
  ShoppingCartIcon,
  UsersIcon,
} from '@yuki/ui/icons'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@yuki/ui/sidebar'
import { env } from '@yuki/validators/env'

export const DashboardSidebar: React.FC<{ user: User }> = ({ user }) => {
  const { pathname } = useLocation()

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader className='h-12 border-b border-sidebar-border'>
        <Link to='/' className='flex items-center gap-2 font-semibold'>
          <img
            src='/assets/logo.svg'
            alt='Yuki Logo'
            className='size-6 dark:invert'
          />
          <span className='group-data-[collapsible=icon]:hidden'>
            Dashboard | Yukinu
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigation.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  isActive={
                    item.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(item.href)
                  }
                  asChild
                >
                  <Link to={item.href}>
                    <item.icon />
                    {item.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='border-t border-sidebar-border'>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <Avatar className='size-6'>
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <span className='group-data-[collapsible=icon]:hidden'>
                      {user.name}
                    </span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side='right'
                  align='start'
                  className='w-(--radix-popper-anchor-width)'
                >
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`${env.NEXT_PUBLIC_APP_URL}/account/settings`}>
                      <Settings /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Form action='/api/auth/sign-out' method='post'>
                      <input type='hidden' name='redirectTo' value='/' />
                      <button type='submit' className='flex items-center gap-2'>
                        <LogOutIcon /> Logout
                      </button>
                    </Form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

const navigation = [
  {
    name: 'Home',
    href: env.NEXT_PUBLIC_APP_URL,
    icon: HomeIcon,
  },
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboardIcon,
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: ShoppingCartIcon,
  },
  {
    name: 'Products',
    href: '/products',
    icon: PackageIcon,
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: UsersIcon,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: LineChartIcon,
  },
]
