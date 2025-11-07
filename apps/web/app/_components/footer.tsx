import Link from 'next/link'

import { Button } from '@yukinu/ui/button'
import {
  CopyrightIcon,
  FacebookIcon,
  GithubIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  XFormerTwitterIcon,
} from '@yukinu/ui/icons'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@yukinu/ui/input-group'
import { env } from '@yukinu/validators/env.next'

import { Brand } from '@/app/_components/brand'

export function Footer() {
  return (
    <footer className='border-t border-border bg-card/50 py-12'>
      <h2 className='sr-only'>Footer section</h2>

      <div className='container flex flex-col'>
        <div className='mb-8 grid gap-8 sm:grid-cols-2 md:grid-cols-4'>
          <div className='space-y-4 sm:col-span-2 md:col-span-1'>
            <Brand titleClassName='font-semibold' />

            <p className='text-sm text-muted-foreground'>
              {env.NEXT_PUBLIC_APP_DESCRIPTION}
            </p>

            <div className='flex gap-6'>
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-muted-foreground transition-colors hover:text-foreground'
                >
                  <link.icon className='size-4' aria-hidden='true' />
                  <span className='sr-only'>{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          {navItems.map((item) => (
            <section key={item.title} className='space-y-4'>
              <h3 className='font-semibold'>{item.title}</h3>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                {item.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className='transition-colors hover:text-foreground'
                      {...(link.href.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className='space-y-4 sm:col-span-2 md:col-span-1'>
            <h3 className='font-semibold'>STAY UPDATED</h3>
            <p className='text-sm text-muted-foreground'>
              Subscribe to our newsletter to get the latest updates and news.
            </p>
            <InputGroup>
              <InputGroupInput placeholder='Your email address' type='email' />
              <InputGroupAddon align='inline-end'>
                <Button variant='ghost' size='sm'>
                  Subscribe
                </Button>
              </InputGroupAddon>
            </InputGroup>

            <ul className='space-y-2 text-sm text-muted-foreground'>
              {contactInfos.map((contact) => (
                <li key={contact.label} className='flex items-center gap-2'>
                  <contact.icon className='size-4 text-foreground' />
                  <span>{contact.label}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className='flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row'>
          <p className='flex items-center gap-1 [&_svg]:size-4'>
            <CopyrightIcon /> {new Date().getFullYear()}{' '}
            {env.NEXT_PUBLIC_APP_NAME}. All rights reserved.
          </p>
          <p>
            Designed and Developed by{' '}
            <a
              href='https://tiesen.id.vn'
              target='_blank'
              rel='noopener noreferrer'
              className='underline hover:text-foreground'
            >
              tiesen243
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

const navItems = [
  {
    title: 'QUICK LINKS',
    links: [
      { label: 'Home', href: '/home' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      {
        label: 'FAQ',
        href: 'https://tiesen243.github.io/yukinu/legal/faq.html',
      },
    ],
  },
  {
    title: 'LEGAL',
    links: [
      {
        label: 'Privacy Policy',
        href: 'https://tiesen243.github.io/yukinu/legal/privacy-policy.html',
      },
      {
        label: 'Terms of Service',
        href: 'https://tiesen243.github.io/yukinu/legal/term-of-service.html',
      },
      {
        label: 'Cookies Policy',
        href: 'https://tiesen243.github.io/yukinu/legal/cookie.html',
      },
      {
        label: 'Disclaimer',
        href: 'https://tiesen243.github.io/yukinu/legal/disclaimer.html',
      },
      {
        label: 'DMCA Policy',
        href: 'https://tiesen243.github.io/yukinu/legal/dmca.html',
      },
    ],
  },
] as const

const socialLinks = [
  {
    label: 'Twitter',
    icon: XFormerTwitterIcon,
    href: 'https://x.com/tiesen243',
  },
  {
    label: 'Facebook',
    icon: FacebookIcon,
    href: 'https://www.facebook.com/tiesen243.nanoda',
  },
  {
    label: 'GitHub',
    icon: GithubIcon,
    href: 'https://github.com/tiesen243',
  },
]

const contactInfos = [
  { icon: MapPinIcon, label: '67 Skibidi St., Ligma City, Goon' },
  { icon: MailIcon, label: 'support@yukinu.tiesen.id.vn' },
  { icon: PhoneIcon, label: '+69 (727) 034-1836' },
]
