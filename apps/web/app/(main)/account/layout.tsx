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
      <aside className='shrink-0 rounded-xl bg-card py-6 text-card-foreground shadow-sm md:w-1/4 dark:border'>
        <UserHeader />

        <nav className='px-6 pt-4'>
          <ul className='flex flex-row gap-4 overflow-x-auto pb-2 md:flex-col md:gap-2 md:pb-0'>
            {sidebarLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className='inline-flex w-full items-center gap-2 rounded-lg border border-transparent py-1 text-sm font-medium whitespace-nowrap ring-ring hover:text-muted-foreground md:px-3 md:py-2 md:hover:border-primary md:hover:bg-sidebar-accent md:hover:text-sidebar-accent-foreground md:dark:hover:bg-sidebar-accent/50 [&_svg]:size-4'
                >
                  <link.icon className='hidden md:flex' /> {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className='w-full overflow-x-hidden rounded-xl bg-card py-6 shadow-sm dark:border'>
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
