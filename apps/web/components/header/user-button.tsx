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
import {
  HeartIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  ReceiptTextIcon,
  ShieldIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@yukinu/ui/icons'

import { ThemeSwitcher } from '@/components/header/theme-switcher'
import { getDashboardUrl } from '@/lib/utils'

export const UserButton = () => {
  const { status, session, signOut } = useSession()

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
        <Avatar className='size-9 ring-1 ring-transparent ring-offset-1 ring-offset-popover/60 hover:ring-ring focus-visible:ring-ring'>
          <AvatarImage src={user.image ?? ''} />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuLabel className='flex flex-col gap-2'>
          <span>{user.username}</span>
          <span className='text-sm text-muted-foreground'>{user.email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {menuItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href}>
                <item.icon /> {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <a href={getDashboardUrl()}>
              <LayoutDashboardIcon /> Dashboard
            </a>
          </DropdownMenuItem>

          <ThemeSwitcher />

          <DropdownMenuItem onSelect={signOut}>
            <LogOutIcon /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const menuItems = [
  {
    icon: UserIcon,
    label: 'Profile',
    href: '/account',
  },
  {
    icon: HeartIcon,
    label: 'Wishlist',
    href: '/account/wishlist',
  },
  {
    icon: ShoppingCartIcon,
    label: 'My Cart',
    href: '/account/cart',
  },
  {
    icon: ReceiptTextIcon,
    label: 'Order History',
    href: '/account/orders',
  },
  {
    icon: ShieldIcon,
    label: 'Security',
    href: '/account/security',
  },
] as const
