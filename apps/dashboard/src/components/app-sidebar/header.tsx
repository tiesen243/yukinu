import { Link } from 'react-router'

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@yukinu/ui/sidebar'
import { env } from '@yukinu/validators/env.vite'

import Logo from '@/assets/logo.svg'

export const AppSidebarHeader: React.FC = () => (
  <SidebarHeader className='h-16 border-b border-sidebar-border'>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size='lg' asChild>
          <Link to='/'>
            <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
              <img src={Logo} alt='App Logo' className='size-6 invert' />
            </div>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-medium'>{env.VITE_APP_NAME}</span>
              <span className='truncate text-xs'>Multi-vendor E-Commerce</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>
)
