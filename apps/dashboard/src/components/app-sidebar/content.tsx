import { useSession } from '@yukinu/auth/react'
import {
  BarChart2Icon,
  BuildingIcon,
  FileTextIcon,
  FlagIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListOrderedIcon,
  Loader2Icon,
  PackageIcon,
  PercentIcon,
  ShoppingBagIcon,
  StoreIcon,
  TagsIcon,
  TicketsIcon,
  UserCogIcon,
  UsersIcon,
  WalletIcon,
} from '@yukinu/ui/icons'
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
        icon: LayoutDashboardIcon,
        title: 'Overview',
        url: '/',
        roles: ['admin', 'moderator', 'vendor_owner', 'vendor_staff'],
      },
      {
        icon: BarChart2Icon,
        title: 'Analytics',
        url: '/analytics',
        roles: ['admin', 'moderator'],
      },
      {
        icon: FileTextIcon,
        title: 'Sales Reports',
        url: '/sales-reports',
        roles: ['admin', 'moderator', 'vendor_owner'],
      },
      {
        icon: ListOrderedIcon,
        title: 'Activity Log',
        url: '/activity-log',
        roles: ['admin', 'moderator'],
      },
      {
        icon: StoreIcon,
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
        icon: FlagIcon,
        title: 'Banners',
        url: '/admin/banners',
        roles: ['admin', 'moderator'],
      },
      {
        icon: UsersIcon,
        title: 'Users',
        url: '/admin/users',
        roles: ['admin', 'moderator'],
      },
      {
        icon: BuildingIcon,
        title: 'Vendors',
        url: '/admin/vendors',
        roles: ['admin', 'moderator'],
      },
      {
        icon: PackageIcon,
        title: 'Products',
        url: '/admin/products',
        roles: ['admin', 'moderator'],
      },
      {
        icon: PackageIcon,
        title: 'Products',
        url: '/products',
        roles: ['vendor_owner', 'vendor_staff'],
      },
      {
        icon: TagsIcon,
        title: 'Categories',
        url: '/admin/categories',
        roles: ['admin', 'moderator'],
      },
      {
        icon: PercentIcon,
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
        icon: StoreIcon,
        title: 'My Store',
        url: '/vendor/my-store',
        roles: ['vendor_owner'],
      },
      {
        icon: ShoppingBagIcon,
        title: 'Orders',
        url: '/vendor/orders',
        roles: ['vendor_owner', 'vendor_staff'],
      },
      {
        icon: UserCogIcon,
        title: 'Staff Management',
        url: '/vendor/staffs',
        roles: ['vendor_owner'],
      },
      {
        icon: WalletIcon,
        title: 'Payouts',
        url: '/vendor/payouts',
        roles: ['vendor_owner'],
      },
    ],
  },
  {
    id: 'support',
    title: 'Support',
    items: [
      {
        icon: TicketsIcon,
        title: 'Tickets',
        url: '/support/tickets',
        roles: ['admin', 'moderator', 'vendor_owner', 'vendor_staff', 'user'],
      },
      {
        icon: HelpCircleIcon,
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
                        {isPending && <Loader2Icon className='animate-spin' />}
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
