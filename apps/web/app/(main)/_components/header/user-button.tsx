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
  ShoppingBagIcon,
  ShoppingCartIcon,
  SunIcon,
  SunMoonIcon,
  UserIcon,
} from '@yukinu/ui/icons'

export const UserButton: React.FC = () => {
  const { session, status, signOut } = useSession()

  if (status === 'loading')
    return <div className='size-9 animate-pulse rounded-full bg-muted' />

  if (status === 'unauthenticated')
    return (
      <Button variant='ghost' asChild>
        <Link href='/login'>Sign In</Link>
      </Button>
    )

  const { user } = session

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className='size-9 ring-1 ring-transparent ring-offset-1 ring-offset-transparent hover:ring-ring'>
          <AvatarImage src={user.avatarUrl ?? ''} alt={user.username} />
          <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuLabel className='flex flex-col gap-1'>
          <span>{user.username}</span>
          <span className='text-muted-foreground'>{user.email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShoppingCartIcon /> Cart
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShoppingBagIcon /> Orders
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <ThemeChanger />
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOutIcon /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const ThemeChanger: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <SunMoonIcon /> Appearance
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem
            onClick={() => {
              setTheme('light')
            }}
            aria-checked={theme === 'light'}
            role='menuitemradio'
          >
            <SunIcon /> Light
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setTheme('dark')
            }}
            aria-checked={theme === 'dark'}
            role='menuitemradio'
          >
            <MoonIcon /> Dark
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setTheme('system')
            }}
            aria-checked={theme === 'system'}
            role='menuitemradio'
          >
            <LaptopIcon /> System
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
