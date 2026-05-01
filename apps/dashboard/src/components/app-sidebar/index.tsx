import Logo from '@assets/logo.svg'
import {
  ChartBarIcon,
  ClipboardCheckIcon,
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
    { title: 'Dashboard', url: '/', icon: LayoutDashboardIcon },
    { title: 'Analytics', url: '/analytics', icon: ChartBarIcon },
  ],
  navContent: [
    {
      title: 'Management',
      items: [
        { name: 'Users', url: '/management/users', icon: UsersIcon },
        { name: 'Banners', url: '/management/banners', icon: MegaphoneIcon },
        { name: 'Vouchers', url: '/management/vouchers', icon: TicketsIcon },
        { name: 'Orders', url: '/management/orders', icon: ClipboardCheckIcon },
      ],
    },
    {
      title: 'Catalog',
      items: [
        { name: 'Categories', url: '/catalog/categories', icon: TagIcon },
        { name: 'Products', url: '/catalog/products', icon: PackageIcon },
      ],
    },
    {
      title: 'Merchant',
      items: [
        { name: 'Vendors', url: '/merchant/vendors', icon: StoreIcon },
        { name: 'My Store', url: '/merchant/my-store', icon: StoreIcon },
        { name: 'Staffs', url: '/merchant/staffs', icon: UserStarIcon },
        { name: 'Balance', url: '/merchant/balance', icon: HandCoinsIcon },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Get Help',
      url: '/tickets',
      icon: MessageCircleQuestionIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
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
        <NavMain items={data.navMain} />
        {data.navContent.map((content) => (
          <NavContent
            key={content.title}
            label={content.title}
            items={content.items}
          />
        ))}
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
