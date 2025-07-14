'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  MapPinHouseIcon,
  ShieldIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@yuki/ui/icons'
import { Tabs, TabsList, TabsTrigger } from '@yuki/ui/tabs'

export const Navigation = () => {
  const pathName = usePathname()

  return (
    <Tabs defaultValue={pathName} className='hidden md:flex'>
      <TabsList className='flex h-fit flex-col' variant='light' asChild>
        <nav>
          {navItems.map((item) => (
            <TabsTrigger value={item.href} key={item.name} asChild>
              <Link href={item.href} className='w-full justify-start'>
                <item.icon />
                {item.name}
              </Link>
            </TabsTrigger>
          ))}
        </nav>
      </TabsList>
    </Tabs>
  )
}

const navItems = [
  {
    name: 'My Account',
    icon: UserIcon,
    href: '/profile',
  },
  {
    name: 'My Address',
    icon: MapPinHouseIcon,
    href: '/profile/address',
  },
  {
    name: 'My Orders',
    icon: ShoppingBagIcon,
    href: '/profile/orders',
  },
  {
    name: 'My Cart',
    icon: ShoppingCartIcon,
    href: '/profile/cart',
  },
  {
    name: 'Sercurity',
    icon: ShieldIcon,
    href: '/profile/security',
  },
]
