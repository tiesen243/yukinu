import Link from 'next/link'

import {
  HeartIcon,
  MapPinIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@yukinu/ui/icons'

import { UserHeader } from '@/app/(main)/account/_components/user-header'

export default function AccountLayout({ children }: LayoutProps<'/account'>) {
  return (
    <div className='container flex h-dvh w-full flex-1 flex-col gap-6 py-6 md:flex-row'>
      <aside className='rounded-xl bg-sidebar py-6 text-sidebar-foreground shadow-sm md:sticky md:top-20 md:left-0 md:w-1/4 dark:border'>
        <UserHeader />

        <nav className='flex w-full flex-row gap-2 overflow-x-auto px-6 pt-4 pb-2 md:flex-col md:pb-0'>
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='inline-flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium whitespace-nowrap ring-ring hover:border-primary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:hover:bg-sidebar-accent/50 [&_svg]:size-4'
            >
              <link.icon className='hidden md:flex' /> {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className='relative w-full rounded-xl bg-card py-6 shadow-sm dark:border'>
        {children}
      </main>
    </div>
  )
}

const sidebarLinks = [
  {
    href: '/account',
    icon: UserIcon,
    label: 'Profile',
  },
  {
    href: '/account/wishlist',
    icon: HeartIcon,
    label: 'Wishlist',
  },
  {
    href: '/account/cart',
    icon: ShoppingCartIcon,
    label: 'My Cart',
  },
  {
    href: '/account/address',
    icon: MapPinIcon,
    label: 'Addresses',
  },
  {
    href: '/account/orders',
    icon: ReceiptIcon,
    label: 'Orders History',
  },
  {
    href: '/account/security',
    icon: ShieldCheckIcon,
    label: 'Security',
  },
] as const
