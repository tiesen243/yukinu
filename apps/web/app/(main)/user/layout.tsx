import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@yukinu/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'
import { ReceiptTextIcon, ShoppingCartIcon, UserIcon } from '@yukinu/ui/icons'

export default async function UserLayout({ children }: LayoutProps<'/user'>) {
  const session = await auth({ headers: await headers() })
  if (!session.user) redirect('/login')

  const { user } = session

  return (
    <main className='container flex flex-1 flex-col items-start gap-4 py-4 sm:flex-row'>
      <h1 className='sr-only'>User Account</h1>

      <aside className='flex basis-1/6 flex-col gap-6'>
        <h2 className='sr-only'>Sidebar Navigation</h2>

        <section className='flex items-center gap-2 sm:flex-col md:flex-row'>
          <Avatar>
            <AvatarImage src={user.avatarUrl ?? ''} alt={user.username} />
            <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className='max-w-full break-all *:line-clamp-1'>
            <h3 className='font-medium'>{user.username}</h3>
            <p className='text-sm text-muted-foreground'>{user.email}</p>
          </div>
        </section>

        <nav>
          <ul className='flex flex-row gap-2 text-sm break-all transition-colors sm:flex-col [&_a]:w-full [&_a]:rounded-md [&_a]:px-2 [&_a]:py-1 [&_a]:hover:bg-accent [&_a]:hover:text-accent-foreground'>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link className='flex items-center gap-2' href={item.href}>
                  <item.icon className='size-4' />
                  <span className='line-clamp-1'>{item.label}</span>
                </Link>
                {item.subItems.length > 0 && (
                  <ul className='hidden flex-col gap-2 pt-2 pl-6 sm:flex'>
                    {item.subItems.map((sub) => (
                      <li key={sub.href} className=''>
                        <Link href={sub.href} className='line-clamp-1'>
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <section className='w-full flex-1 rounded-lg border bg-card py-4 text-card-foreground shadow-sm'>
        <h2 className='sr-only'>Content</h2>
        {children}
      </section>
    </main>
  )
}

const navItems = [
  {
    label: 'My Account',
    href: '/user/account/profile',
    icon: UserIcon,
    subItems: [
      { label: 'Profile', href: '/user/account/profile' },
      { label: 'Payment Methods', href: '/user/account/payment' },
      { label: 'Addresses', href: '/user/account/address' },
      { label: 'Change Password', href: '/user/account/password' },
      { label: 'Privacy', href: '/user/account/privacy' },
    ],
  },
  { label: 'Cart', href: '/user/cart', icon: ShoppingCartIcon, subItems: [] },
  {
    label: 'Purchases',
    href: '/user/purchase',
    icon: ReceiptTextIcon,
    subItems: [],
  },
] as const
