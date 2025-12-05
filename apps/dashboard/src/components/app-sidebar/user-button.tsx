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

export const UserButton: React.FC = () => {
  const { status, session, signOut } = useSession()
  const { isMobile } = useSidebar()
  const { theme, setTheme } = useTheme()

  if (status !== 'authenticated') return

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground dark:data-[state=open]:bg-sidebar-accent/50'
            >
              <UserAvatar {...session.user} />
              <EllipsisVerticalIcon className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='flex items-center gap-2 p-0 px-1 py-1.5 text-left text-sm font-normal'>
              <UserAvatar {...session.user} />
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() => {
                  setTheme(theme === 'light' ? 'dark' : 'light')
                }}
              >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={signOut}>
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
