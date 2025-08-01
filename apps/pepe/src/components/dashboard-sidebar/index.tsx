import { Link } from 'react-router'

import type { User } from '@yuki/auth'
import {
  BaggageClaimIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LineChartIcon,
  PackageIcon,
  PackageSearchIcon,
  ShoppingCartIcon,
  UsersIcon,
} from '@yuki/ui/icons'
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@yuki/ui/sidebar'
import { env } from '@yuki/validators/env'

import { NavMain } from '@/components/dashboard-sidebar/nav-main'
import { NavUser } from '@/components/dashboard-sidebar/nav-user'

export const DashboardSidebar: React.FC<{ user: User }> = ({ user }) => (
  <Sidebar collapsible='icon'>
    <SidebarHeader className='h-12 border-b border-sidebar-border'>
      <Link to='/' className='flex items-center gap-2 font-semibold'>
        <img
          src='/assets/logo.svg'
          alt='Yuki Logo'
          className='size-8 dark:invert'
        />
        <span className='whitespace-nowrap group-data-[collapsible=icon]:hidden'>
          Dashboard | Yukinu
        </span>
      </Link>
    </SidebarHeader>

    <NavMain isAdmin={user.role === 'admin'} navigation={navigation} />

    <SidebarFooter className='border-t border-sidebar-border'>
      <NavUser user={user} />
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
)

const navigation = [
  {
    name: 'Home',
    href: env.NEXT_PUBLIC_APP_URL,
    icon: HomeIcon,
    isAdmin: false,
  },
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboardIcon,
    isAdmin: false,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: LineChartIcon,
    isAdmin: true,
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: ShoppingCartIcon,
    isAdmin: false,
  },
  {
    name: 'All Orders',
    href: '/all-orders',
    icon: BaggageClaimIcon,
    isAdmin: true,
  },
  {
    name: 'Products',
    href: '/products',
    icon: PackageIcon,
    isAdmin: false,
  },
  {
    name: 'All Products',
    href: '/all-products',
    icon: PackageSearchIcon,
    isAdmin: true,
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: UsersIcon,
    isAdmin: true,
  },
]
