import { Link } from 'react-router'

import type { User } from '@yuki/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@yuki/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@yuki/ui/dropdown-menu'
import {
  BadgeCheckIcon,
  ChevronsUpDownIcon,
  LogOutIcon,
  ShieldIcon,
} from '@yuki/ui/icons'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@yuki/ui/sidebar'
import { env } from '@yuki/validators/env'

export const NavUser: React.FC<{ user: User }> = ({ user }) => {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <UserCard user={user} />
              <ChevronsUpDownIcon className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal' asChild>
              <UserCard user={user} />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to={`${env.NEXT_PUBLIC_APP_URL}/account/profile`}>
                  <BadgeCheckIcon /> Account
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to={`${env.NEXT_PUBLIC_APP_URL}/account/security`}>
                  <ShieldIcon /> Security
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOutIcon /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

const UserCard: React.FC<{ user: User }> = ({ user }) => (
  <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
    <Avatar className='h-8 w-8 rounded-lg'>
      <AvatarImage src={user.image} alt={user.name} />
      <AvatarFallback className='rounded-lg'>
        {user.name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
    <div className='grid flex-1 text-left text-sm leading-tight'>
      <span className='truncate font-medium'>{user.name}</span>
      <span className='truncate text-xs'>{user.email}</span>
    </div>
  </div>
)
