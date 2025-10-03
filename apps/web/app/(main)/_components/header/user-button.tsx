'use client'

import Link from 'next/link'

import { useSession } from '@yukinu/auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'
import { Button } from '@yukinu/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@yukinu/ui/dropdown-menu'
import { LogOutIcon, User2Icon } from '@yukinu/ui/icons'

export const UserButton: React.FC = () => {
  const { session, status, signOut } = useSession()

  if (status === 'loading')
    return <div className='size-8 animate-pulse rounded-full bg-current' />

  if (status === 'unauthenticated')
    return (
      <Button variant='outline' size='sm' asChild>
        <Link href='/login'>Sign In</Link>
      </Button>
    )

  const { user } = session

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='rounded-full outline-none focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background'>
        <Avatar className='size-8 cursor-pointer'>
          <AvatarImage src={user.avatarUrl ?? ''} alt={user.username} />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className='sr-only'>Open user menu</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuLabel className='flex flex-col gap-0.5'>
          <p className='text-sm font-medium'>{user.username}</p>
          <p className='text-xs text-muted-foreground'>{user.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href='/#'>
              <User2Icon /> Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => signOut({ redirectUrl: '/' })}>
            <LogOutIcon /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
