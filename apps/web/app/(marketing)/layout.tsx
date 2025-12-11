import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@yukinu/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@yukinu/ui/collapsible'
import { MenuIcon, XIcon } from '@yukinu/ui/icons'
import { env } from '@yukinu/validators/env.next'

export default function MarketingLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Collapsible asChild>
        <header className='group/header sticky inset-0'>
          <nav className='flex h-14 items-center border-b bg-popover/60 text-popover-foreground backdrop-blur-xl backdrop-saturate-150 group-data-[state=open]/header:border-transparent'>
            <div className='container flex items-center justify-between gap-6'>
              <Link href='/' className='flex items-center gap-2'>
                <Image
                  src='/assets/logo.svg'
                  alt={`${env.NEXT_PUBLIC_APP_NAME} Logo`}
                  width={36}
                  height={36}
                  className='dark:invert'
                />
                <span className='text-lg font-bold'>
                  {env.NEXT_PUBLIC_APP_NAME}
                </span>
              </Link>

              <ul className='hidden items-center gap-4 md:flex'>
                {navLinks.map((link) => (
                  <li
                    key={link.href}
                    className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>

              <div className='hidden gap-4 md:flex'>
                <Button variant='ghost' size='sm' asChild>
                  <Link href='/login'>Sign In</Link>
                </Button>
                <Button size='sm' asChild>
                  <Link href='/'>Get Started</Link>
                </Button>
              </div>

              <CollapsibleTrigger className='md:hidden data-[state=closed]:[&_[data-slot="close-icon"]]:hidden data-[state=open]:[&_svg[data-slot="open-icon"]]:hidden'>
                <MenuIcon data-slot='open-icon' />
                <XIcon data-slot='close-icon' />
                <span className='sr-only'>Toggle Menu</span>
              </CollapsibleTrigger>
            </div>
          </nav>

          <CollapsibleContent className='absolute top-14 z-50 w-full border-b bg-popover/60 py-4 text-popover-foreground backdrop-blur-xl backdrop-saturate-150 md:hidden'>
            <nav className='container flex flex-col gap-4'>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
                >
                  {link.label}
                </Link>
              ))}

              <div className='grid grid-cols-2 gap-4'>
                <Button variant='ghost' asChild>
                  <Link href='/login'>Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href='/'>Get Started</Link>
                </Button>
              </div>
            </nav>
          </CollapsibleContent>
        </header>
      </Collapsible>

      {children}
    </>
  )
}

const navLinks = [
  { href: '/home#features', label: 'Features' },
  { href: '/home#for-buyers', label: 'For Buyers' },
  { href: '/home#for-sellers', label: 'For Sellers' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const
