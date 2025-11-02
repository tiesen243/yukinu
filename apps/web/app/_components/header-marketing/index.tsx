import Link from 'next/link'

import { Button } from '@yukinu/ui/button'

import { Brand } from '@/app/_components/brand'

export function Header() {
  return (
    <header className='sticky inset-0 z-50 border-b bg-card/70 backdrop-blur-sm'>
      <nav className='container flex h-14 items-center justify-between gap-6'>
        <Brand />

        <div className='hidden items-center gap-8 md:flex'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className='text-sm transition-colors hover:text-muted-foreground'
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Button size='sm' asChild>
          <Link href='/login'>Get Started</Link>
        </Button>
      </nav>
    </header>
  )
}

const navItems = [
  {
    label: 'Features',
    href: '/home#features',
  },
  {
    label: 'Statistics',
    href: '/home#statistics',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
] as const
