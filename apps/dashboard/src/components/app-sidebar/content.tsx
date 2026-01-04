import { useSession } from '@yukinu/auth/react'
import * as icons from '@yukinu/ui/icons'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@yukinu/ui/sidebar'
import { NavLink } from 'react-router'

const navs = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    items: [
      {
        icon: icons.LayoutDashboardIcon,
        title: 'Overview',
        url: '/',
        roles: ['admin', 'moderator', 'vendor_owner', 'vendor_staff'],
      },
      {
        icon: icons.BarChart2Icon,
        title: 'Analytics',
        url: '/analytics',
        roles: ['admin', 'moderator'],
      },
      {
        icon: icons.FileTextIcon,
        title: 'Sales Reports',
        url: '/sales-reports',
        roles: ['admin', 'moderator', 'vendor_owner'],
      },
      {
        icon: icons.ListOrderedIcon,
        title: 'Activity Log',
        url: '/activity-log',
        roles: ['admin', 'moderator'],
      },
      {
        icon: icons.StoreIcon,
        title: 'Become a Vendor',
        url: '/apply-vendor',
        roles: ['user'],
      },
    ],
  },
  {
    id: 'management',
    title: 'Management',
    items: [
      {
        icon: icons.FlagIcon,
        title: 'Banners',
        url: '/admin/banners',
        roles: ['admin', 'moderator'],
      },
      {
        icon: icons.UsersIcon,
        title: 'Users',
        url: '/admin/users',
        roles: ['admin', 'moderator'],
      },
      {
        icon: icons.BuildingIcon,
        title: 'Vendors',
        url: '/admin/vendors',
        roles: ['admin', 'moderator'],
      },
      {
        icon: icons.PackageIcon,
        title: 'Products',
        url: '/admin/products',
        roles: ['admin', 'moderator'],
      },
      {
        icon: icons.PackageIcon,
        title: 'Products',
        url: '/products',
        roles: ['vendor_owner', 'vendor_staff'],
      },
      {
        icon: icons.TagsIcon,
        title: 'Categories',
        url: '/admin/categories',
        roles: ['admin', 'moderator'],
      },
      {
        icon: icons.PercentIcon,
        title: 'Coupons',
        url: '/admin/coupons',
        roles: ['admin', 'moderator'],
      },
    ],
  },
  {
    id: 'vendor-panel',
    title: 'Vendor Panel',
    items: [
      {
        icon: icons.StoreIcon,
        title: 'My Store',
        url: '/vendor/my-store',
        roles: ['vendor_owner'],
      },
      {
        icon: icons.ShoppingBagIcon,
        title: 'Orders',
        url: '/vendor/orders',
        roles: ['vendor_owner', 'vendor_staff'],
      },
      {
        icon: icons.UserCogIcon,
        title: 'Staff Management',
        url: '/vendor/staffs',
        roles: ['vendor_owner'],
      },
    ],
  },
  {
    id: 'support',
    title: 'Support',
    items: [
      {
        icon: icons.TicketsIcon,
        title: 'Tickets',
        url: '/support/tickets',
        roles: ['admin', 'moderator', 'vendor_owner', 'vendor_staff', 'user'],
      },
      {
        icon: icons.HelpCircleIcon,
        title: 'FAQ',
        url: '/support/faq',
        roles: ['admin', 'moderator', 'vendor_owner', 'vendor_staff', 'user'],
      },
    ],
  },
]

export const AppSidebarContent: React.FC = () => {
  const { status, session } = useSession()

  if (status !== 'authenticated') return null

  return navs.map((nav) => (
    <SidebarGroup key={nav.id}>
      <SidebarGroupLabel>{nav.title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {nav.items.map(
            (item) =>
              item.roles.includes(session.user.role) && (
                <SidebarMenuItem key={item.url}>
                  <NavLink to={item.url}>
                    {({ isActive, isPending }) => (
                      <SidebarMenuButton isActive={isActive}>
                        <item.icon /> {item.title}
                        {isPending && (
                          <icons.Loader2Icon className='animate-spin' />
                        )}
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ),
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ))
}
