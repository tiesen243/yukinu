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
  LayoutDashboardIcon,
  LogOutIcon,
  MoonIcon,
  ReceiptTextIcon,
  ShoppingCartIcon,
  SunIcon,
  SunMoonIcon,
  UserIcon,
} from '@yukinu/ui/icons'

const navItems = [
  { label: 'Profile', href: '/user/account/profile', icon: UserIcon },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboardIcon },
  { label: 'Cart', href: '/user/cart', icon: ShoppingCartIcon },
  { label: 'Purchases', href: '/user/purchase', icon: ReceiptTextIcon },
] as const

export const UserButton: React.FC = () => {
  const { session, status } = useSession()

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
      <DropdownMenuTrigger className='rounded-full focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none'>
        <Avatar className='size-9'>
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
          {navItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href as never}>
                <item.icon /> {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <ThemeChanger />
          <SignOutButton />
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

const SignOutButton: React.FC = () => {
  const { signOut } = useSession()

  return (
    <DropdownMenuItem onClick={signOut}>
      <LogOutIcon /> Sign Out
    </DropdownMenuItem>
  )
}
