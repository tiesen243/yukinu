import { Suspense } from 'react'
import Link from 'next/link'

import { Brand } from '@/app/_components/brand'
import {
  Copyright,
  CopyrightSkeleton,
} from '@/app/_components/footer/copyright'

export function Footer() {
  return (
    <footer className='border-t border-border bg-card/50 py-12'>
      <h2 className='sr-only'>Footer section</h2>

      <div className='container flex flex-col'>
        <div className='mb-8 grid gap-8 sm:grid-cols-2 md:grid-cols-4'>
          <div className='space-y-4 sm:col-span-2 md:col-span-1'>
            <Brand />

            <p className='text-sm text-muted-foreground'>
              Building the future of marketplaces.
            </p>
          </div>

          {navItems.map((item) => (
            <div key={item.title} className='space-y-4'>
              <h2 className='font-semibold'>{item.title}</h2>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                {item.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className='transition-colors hover:text-foreground'
                      {...(link.href.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row'>
          <Suspense fallback={<CopyrightSkeleton />}>
            <Copyright />
          </Suspense>

          <div className='flex gap-6'>
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target='_blank'
                rel='noopener noreferrer'
                className='transition-colors hover:text-foreground'
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

const navItems = [
  {
    title: 'Product',
    links: [
      { title: 'Features', href: '/product#features' },
      { title: 'Pricing', href: '/product#pricing' },
      { title: 'Security', href: '/product#security' },
    ],
  },
  {
    title: 'Company',
    links: [
      { title: 'Home', href: '/home' },
      { title: 'About', href: '/about' },
      { title: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      {
        title: 'Privacy Policy',
        href: 'https://tiesen243.github.io/yukinu/legal/privacy-policy.html',
      },
      {
        title: 'Terms of Service',
        href: 'https://tiesen243.github.io/yukinu/legal/term-of-service.html',
      },
      {
        title: 'Cookies Policy',
        href: 'https://tiesen243.github.io/yukinu/legal/cookie.html',
      },
    ],
  },
] as const

const socialLinks = [
  {
    label: 'Twitter',
    href: 'https://x.com/tiesen243',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/tiesen243/',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/tiesen243',
  },
]
