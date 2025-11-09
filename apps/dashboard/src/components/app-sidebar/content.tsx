//#region imports
import { Activity } from 'react'
import { NavLink } from 'react-router'

import { useSession } from '@yukinu/auth/react'
import {
  BarChart3Icon,
  DollarSignIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  Loader2Icon,
  PackageIcon,
  SettingsIcon,
  ShoppingCartIcon,
  StarIcon,
  StoreIcon,
  TagIcon,
  Users2Icon,
  UsersIcon,
} from '@yukinu/ui/icons'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@yukinu/ui/sidebar'

//#endregion

export const AppSidebarContent: React.FC = () => {
  const { session, status } = useSession()

  if (status === 'loading') return <SidebarContent></SidebarContent>
  else if (status !== 'authenticated') return null

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
        <SidebarMenu>
          {mainMenuItems
            .filter((item) => item.roles.includes(session.user.role))
            .map((item) => (
              <SidebarMenuItem key={item.title}>
                <NavLink to={item.href}>
                  {({ isActive, isPending }) => (
                    <SidebarMenuButton isActive={isActive} asChild>
                      <span>
                        <item.icon /> {item.title}
                        <Activity mode={isPending ? 'visible' : 'hidden'}>
                          <Loader2Icon className='animate-spin' />
                        </Activity>
                      </span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarGroup>

      {reportMenuItems.some((item) =>
        item.roles.includes(session.user.role),
      ) && (
        <SidebarGroup>
          <SidebarGroupLabel>Reports</SidebarGroupLabel>
          <SidebarMenu>
            {reportMenuItems
              .filter((item) => item.roles.includes(session.user.role))
              .map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink to={item.href}>
                    {({ isActive, isPending }) => (
                      <SidebarMenuButton isActive={isActive} asChild>
                        <span>
                          <item.icon /> {item.title}
                          <Activity mode={isPending ? 'visible' : 'hidden'}>
                            <Loader2Icon className='animate-spin' />
                          </Activity>
                        </span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>
      )}
    </SidebarContent>
  )
}

const mainMenuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboardIcon,
    href: '/',
    roles: ['admin', 'moderator', 'vendor_owner'],
  },
  {
    title: 'Orders',
    icon: ShoppingCartIcon,
    href: '/orders',
    roles: ['admin', 'vendor_owner', 'vendor_staff'],
  },
  {
    title: 'Products',
    icon: PackageIcon,
    href: '/products',
    roles: ['admin', 'vendor_owner', 'vendor_staff'],
  },
  {
    title: 'Promotions',
    icon: TagIcon,
    href: '/promotions',
    roles: ['admin', 'moderator'],
  },
  {
    title: 'Reviews',
    icon: StarIcon,
    href: '/reviews',
    roles: ['admin', 'moderator', 'vendor_owner', 'vendor_staff'],
  },
  {
    title: 'Vendors',
    icon: UsersIcon,
    href: '/vendors',
    roles: ['admin', 'moderator'],
  },
  {
    title: 'Register Shop',
    icon: StoreIcon,
    href: '/vendors/register',
    roles: ['user'],
  },
  {
    title: 'My Shop',
    icon: StoreIcon,
    href: '/vendors/me',
    roles: ['vendor_owner', 'vendor_staff'],
  },
  {
    title: 'Users',
    icon: Users2Icon,
    href: '/users',
    roles: ['admin', 'moderator'],
  },
  {
    title: 'Settings',
    icon: SettingsIcon,
    href: '/settings',
    roles: ['admin', 'moderator', 'vendor_owner', 'vendor_staff', 'user'],
  },
]

const reportMenuItems = [
  {
    title: 'Analytics',
    icon: BarChart3Icon,
    href: '/reports/analytics',
    roles: ['admin', 'moderator'],
  },
  {
    title: 'Sales Reports',
    icon: DollarSignIcon,
    href: '/reports/sales',
    roles: ['admin', 'moderator'],
  },
  {
    title: 'Vendor Performance',
    icon: UsersIcon,
    href: '/reports/vendors',
    roles: ['admin', 'moderator'],
  },
  {
    title: 'Support Tickets',
    icon: LifeBuoyIcon,
    href: '/reports/support',
    roles: ['admin', 'moderator'],
  },
]
