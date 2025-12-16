import { useSession } from '@yukinu/auth/react'
import { useTheme } from '@yukinu/ui'
import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@yukinu/ui/dropdown-menu'
import {
  EllipsisVerticalIcon,
  HomeIcon,
  LogOutIcon,
  MoonIcon,
  SunIcon,
} from '@yukinu/ui/icons'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@yukinu/ui/sidebar'

import { getWebUrl } from '@/lib/utils'

export const UserButton: React.FC = () => {
  const { status, session, signOut } = useSession()
  const { isMobile } = useSidebar()
  const { theme, setTheme } = useTheme()

  if (status !== 'authenticated') return

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size='lg'>
                <UserAvatar {...session.user} />
                <EllipsisVerticalIcon className='ml-auto size-4' />
              </SidebarMenuButton>
            }
          />

          <DropdownMenuContent
            className='min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className='flex items-center gap-2 p-0 px-1 py-1.5 text-left text-sm font-normal'>
                <UserAvatar {...session.user} />
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                render={
                  <a href={getWebUrl()}>
                    <HomeIcon /> Go to Website
                  </a>
                }
              />

              <DropdownMenuItem
                onClick={() => {
                  setTheme(theme === 'light' ? 'dark' : 'light')
                }}
              >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={signOut}>
              <LogOutIcon /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

const UserAvatar: React.FC<{
  username: string
  email: string
  image: string | null
}> = ({ username, email, image }) => {
  return (
    <>
      <Avatar className='size-8 rounded-lg'>
        <AvatarImage src={image ?? ''} alt={username} />
        <AvatarFallback className='rounded-lg'>
          {username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className='grid flex-1 text-left text-sm leading-tight'>
        <span className='truncate font-medium'>{username}</span>
        <span className='truncate text-xs text-muted-foreground'>{email}</span>
      </div>
    </>
  )
}
