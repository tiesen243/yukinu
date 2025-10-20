import { Link, useLocation } from 'react-router'

import {
  BarChart3Icon,
  DollarSignIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingCartIcon,
  StarIcon,
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

export const AppSidebarContent: React.FC = () => {
  const location = useLocation()

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
        <SidebarMenu>
          {mainMenuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={
                  item.href === ''
                    ? location.pathname === '/dashboard'
                    : location.pathname.startsWith(`/dashboard/${item.href}`)
                }
                asChild
              >
                <Link to={`/dashboard/${item.href}`}>
                  <item.icon /> {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Reports</SidebarGroupLabel>
        <SidebarMenu>
          {reportMenuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={location.pathname.startsWith(
                  `/dashboard/${item.href}`,
                )}
                asChild
              >
                <Link to={`/dashboard/${item.href}`}>
                  <item.icon /> {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  )
}

const mainMenuItems = [
  { title: 'Dashboard', icon: LayoutDashboardIcon, href: '' },
  { title: 'Products', icon: PackageIcon, href: 'products' },
  { title: 'Orders', icon: ShoppingCartIcon, href: 'orders' },
  { title: 'Customers', icon: Users2Icon, href: 'customers' },
  { title: 'Vendors', icon: UsersIcon, href: 'vendors' },
  { title: 'Promotions', icon: TagIcon, href: 'promotions' },
  { title: 'Reviews', icon: StarIcon, href: 'reviews' },
  { title: 'Settings', icon: SettingsIcon, href: 'settings' },
]

const reportMenuItems = [
  { title: 'Analytics', icon: BarChart3Icon, href: 'reports/analytics' },
  { title: 'Sales Reports', icon: DollarSignIcon, href: 'reports/sales' },
  { title: 'Vendor Performance', icon: UsersIcon, href: 'reports/vendors' },
  { title: 'Support Tickets', icon: LifeBuoyIcon, href: 'reports/support' },
]
