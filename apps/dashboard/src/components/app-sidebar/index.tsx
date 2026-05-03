import Logo from '@assets/logo.svg'
import { useSession } from '@yukinu/auth/react'
import {
  ArrowLeftRightIcon,
  ChartBarIcon,
  ClipboardCheckIcon,
  ExternalLinkIcon,
  HandCoinsIcon,
  LayoutDashboardIcon,
  MegaphoneIcon,
  MessageCircleQuestionIcon,
  PackageIcon,
  StoreIcon,
  TagIcon,
  TicketsIcon,
  UsersIcon,
  UserStarIcon,
} from '@yukinu/ui/icons'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@yukinu/ui/sidebar'
import * as React from 'react'
import { Link } from 'react-router'

import { NavContent } from '@/components/app-sidebar/nav-content'
import { NavMain } from '@/components/app-sidebar/nav-main'
import { NavSecondary } from '@/components/app-sidebar/nav-secondary'
import { NavUser } from '@/components/app-sidebar/nav-user'
import { env } from '@/lib/env'

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboardIcon,
      role: ['admin', 'moderator'],
    },
    {
      title: 'Analytics',
      url: '/analytics',
      icon: ChartBarIcon,
      role: ['admin', 'moderator'],
    },
    {
      title: 'Back to Store',
      url: env.VITE_WEB_URL,
      icon: ExternalLinkIcon,
      role: ['admin', 'moderator', 'vendor_owner', 'vendor_staff', 'user'],
    },
  ],
  navContent: [
    {
      title: 'Management',
      items: [
        {
          name: 'Users',
          url: '/management/users',
          icon: UsersIcon,
          role: ['admin', 'moderator'],
        },
        {
          name: 'Banners',
          url: '/management/banners',
          icon: MegaphoneIcon,
          role: ['admin', 'moderator'],
        },
        {
          name: 'Vouchers',
          url: '/management/vouchers',
          icon: TicketsIcon,
          role: ['admin', 'moderator'],
        },
        {
          name: 'Orders',
          url: '/management/orders',
          icon: ClipboardCheckIcon,
          role: ['admin', 'moderator', 'vendor_owner', 'vendor_staff'],
        },
        {
          name: 'Vendors',
          url: '/management/vendors',
          icon: StoreIcon,
          role: ['admin', 'moderator'],
        },
        {
          name: 'Transactions',
          url: '/management/transactions',
          icon: ArrowLeftRightIcon,
          role: ['admin', 'moderator', 'vendor_owner', 'vendor_staff'],
        },
      ],
    },
    {
      title: 'Catalog',
      items: [
        {
          name: 'Categories',
          url: '/catalog/categories',
          icon: TagIcon,
          role: ['admin', 'moderator'],
        },
        {
          name: 'Products',
          url: '/catalog/products',
          icon: PackageIcon,
          role: ['admin', 'moderator', 'vendor_owner', 'vendor_staff'],
        },
      ],
    },
    {
      title: 'Merchant',
      items: [
        {
          name: 'My Store',
          url: '/merchant/my-store',
          icon: StoreIcon,
          role: ['vendor_owner'],
        },
        {
          name: 'Staffs',
          url: '/merchant/staffs',
          icon: UserStarIcon,
          role: ['vendor_owner'],
        },
        {
          name: 'Balance',
          url: '/merchant/balance',
          icon: HandCoinsIcon,
          role: ['vendor_owner'],
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Get Help',
      url: '/tickets',
      icon: MessageCircleQuestionIcon,
      role: ['admin', 'moderator', 'vendor_owner', 'vendor_staff', 'user'],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useSession()

  const filteredData = React.useMemo(() => {
    const filterItems = (
      items:
        | typeof data.navMain
        | (typeof data.navContent)[0]['items']
        | typeof data.navSecondary,
    ) => items.filter((item) => item.role.includes(user?.role || ''))

    return {
      navMain: filterItems(data.navMain),
      navContent: data.navContent.map((content) => ({
        ...content,
        items: filterItems(content.items),
      })),
      navSecondary: filterItems(data.navSecondary),
    } as typeof data
  }, [user?.role])

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className='data-[slot=sidebar-menu-button]:p-1.5!'
              render={<Link to='/' />}
            >
              <img src={Logo} alt='Logo' className='size-5! dark:invert' />
              <span className='text-base font-semibold'>
                {env.VITE_APP_NAME} Dashboard
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredData.navMain} />
        {filteredData.navContent.map((content) => (
          <NavContent
            key={content.title}
            label={content.title}
            items={content.items}
          />
        ))}
        <NavSecondary items={filteredData.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
