import { useSession } from '@yukinu/auth/react'
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
import { EllipsisVerticalIcon, LogOutIcon } from '@yukinu/ui/icons'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@yukinu/ui/sidebar'

const UserInfo: React.FC<{
  user: NonNullable<ReturnType<typeof useSession>['user']>
}> = ({ user }) => (
  <>
    <Avatar className='h-8 w-8 rounded-lg grayscale'>
      <AvatarImage src={user.image ?? ''} alt={user.username} />
      <AvatarFallback className='rounded-lg'>
        {user.username.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
    <div className='grid flex-1 text-left text-sm leading-tight'>
      <span className='truncate font-medium'>{user.username}</span>
      <span className='truncate text-xs text-muted-foreground'>
        {user.email}
      </span>
    </div>
  </>
)

export function NavUser() {
  const { status, user, signOut } = useSession()
  const { isMobile } = useSidebar()

  if (status === 'loading') return null
  if (status === 'unauthenticated') return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              />
            }
          >
            <UserInfo user={user} />
            <EllipsisVerticalIcon className='ml-auto size-4' />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className='flex items-center gap-2 p-0 px-1 py-1.5 text-left text-sm font-normal'>
                <UserInfo user={user} />
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => signOut()}>
                <LogOutIcon /> Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
