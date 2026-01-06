'use client'

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
  ShoppingCartIcon,
  UserIcon,
} from '@yukinu/ui/icons'
import Link from 'next/link'

import { ThemeSwitcher } from '@/components/header/theme-switcher'
import { getDashboardUrl } from '@/lib/utils'

export const UserButton = () => {
  const { status, session, signOut } = useSession()

  if (status === 'loading')
    return <div className='size-9 animate-pulse rounded-full bg-muted' />

  if (status === 'unauthenticated')
    return (
      <Button
        variant='ghost'
        nativeButton={false}
        render={<Link href='/login'>Sign In</Link>}
      />
    )

  const { user } = session

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className='size-9 hover:after:border-ring'>
          <AvatarImage src={user.image ?? ''} />
          <AvatarFallback>
            <UserIcon className='size-4.5 text-muted-foreground' />
          </AvatarFallback>
        </Avatar>

        <span className='sr-only'>User menu</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuGroup>
          <DropdownMenuLabel className='flex flex-col gap-2'>
            <span className='text-sm text-popover-foreground'>
              {user.username}
            </span>
            <span className='text-muted-foreground'>{user.email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.href}
              nativeButton={false}
              render={
                <Link href={item.href}>
                  <item.icon /> {item.label}
                </Link>
              }
            />
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            render={
              // oxlint-disable-next-line no-html-link-for-pages
              <a href={getDashboardUrl()}>
                <LayoutDashboardIcon /> Dashboard
              </a>
            }
          />

          <ThemeSwitcher />

          <DropdownMenuItem variant='destructive' onClick={signOut}>
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
] as const
