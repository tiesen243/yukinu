'use client'

import Link from 'next/link'

import { useSession } from '@yuki/auth/react'
import { useTheme } from '@yuki/ui'
import { Avatar, AvatarFallback, AvatarImage } from '@yuki/ui/avatar'
import { Button } from '@yuki/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@yuki/ui/dropdown-menu'
import {
  HomeIcon,
  LaptopIcon,
  LayoutDashboardIcon,
  LogInIcon,
  LogOutIcon,
  MoonIcon,
  ShieldIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  SunIcon,
  SunMoonIcon,
  UserIcon,
} from '@yuki/ui/icons'
import { env } from '@yuki/validators/env'

export const UserButton: React.FC = () => {
  const { status, session, signOut } = useSession()
  const { theme, setTheme } = useTheme()

  if (status === 'loading')
    return <div className='size-9 animate-pulse rounded-full bg-current' />

  if (status === 'unauthenticated')
    return (
      <Button variant='ghost' className='w-9 md:w-auto' asChild>
        <Link href='/login'>
          <LogInIcon />
          <span className='sr-only md:not-sr-only'>Login</span>
        </Link>
      </Button>
    )

  const { user } = session

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='size-9 cursor-pointer'>
          <AvatarImage src={user.image} />
          <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='min-w-60'>
        <DropdownMenuLabel className='flex flex-col'>
          <p className='text-sm font-medium'>{user.name}</p>
          <p className='text-xs text-muted-foreground'>{user.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {userNavItems.map((item) => (
            <DropdownMenuItem key={item.label} asChild>
              <Link href={item.href}>
                <item.icon /> {item.label}
                <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground">
              <SunMoonIcon /> Apperance
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  className={
                    theme === 'light'
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }
                  onClick={() => {
                    setTheme('light')
                  }}
                >
                  <SunIcon /> Light mode
                  <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={
                    theme === 'dark'
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }
                  onClick={() => {
                    setTheme('dark')
                  }}
                >
                  <MoonIcon /> Dark mode
                  <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={
                    theme === 'system'
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }
                  onClick={() => {
                    setTheme('system')
                  }}
                >
                  <LaptopIcon /> System
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href='/home'>
              <HomeIcon /> Home Page
              <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>

          {session.user.role !== 'user' && (
            <DropdownMenuItem asChild>
              <Link href={env.NEXT_PUBLIC_DASHBOARD_URL}>
                <LayoutDashboardIcon /> Dashboard
                <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => signOut({ redirectUrl: '/' })}>
            <LogOutIcon /> Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const userNavItems = [
  {
    href: '/account/profile',
    label: 'Profile',
    icon: UserIcon,
    shortcut: '⌘P',
  },
  {
    href: '/account/cart',
    label: 'Cart',
    icon: ShoppingCartIcon,
    shortcut: '⌘C',
  },
  {
    href: '/account/orders',
    label: 'Orders',
    icon: ShoppingBagIcon,
    shortcut: '⌘O',
  },
  {
    href: '/account/security',
    label: 'Security',
    icon: ShieldIcon,
    shortcut: '⌘S',
  },
]
