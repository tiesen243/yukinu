'use client'

import Link from 'next/link'

import { useSession } from '@yukinu/auth/react'
import { useTheme } from '@yukinu/ui'
import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'
import { Button } from '@yukinu/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@yukinu/ui/dropdown-menu'
import {
  LaptopIcon,
  LogOutIcon,
  MoonIcon,
  SunIcon,
  SunMoonIcon,
  User2Icon,
} from '@yukinu/ui/icons'

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
      <DropdownMenuTrigger
        className='rounded-full outline-none focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background'
        asChild
      >
        <Avatar className='size-8 cursor-pointer'>
          <AvatarImage src={user.avatarUrl ?? ''} alt={user.username} />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuLabel className='flex flex-col gap-0.5'>
          <p className='text-sm font-medium'>{user.username}</p>
          <p className='text-xs text-muted-foreground'>{user.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href='/profile'>
              <User2Icon /> Profile
            </Link>
          </DropdownMenuItem>

          <ThemeSwitcher />
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

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <SunMoonIcon /> Appearance
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem
            className={theme === 'light' ? '' : 'text-muted-foreground'}
            onClick={() => {
              setTheme('light')
            }}
          >
            <SunIcon /> Light
          </DropdownMenuItem>
          <DropdownMenuItem
            className={theme === 'dark' ? '' : 'text-muted-foreground'}
            onClick={() => {
              setTheme('dark')
            }}
          >
            <MoonIcon /> Dark
          </DropdownMenuItem>
          <DropdownMenuItem
            className={theme === 'system' ? '' : 'text-muted-foreground'}
            onClick={() => {
              setTheme('system')
            }}
          >
            <LaptopIcon /> System
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
