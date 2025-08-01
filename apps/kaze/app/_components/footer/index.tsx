import Link from 'next/link'

import { Alert, AlertDescription, AlertTitle } from '@yuki/ui/alert'
import { Button } from '@yuki/ui/button'
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  XFormerTwitterIcon,
  YoutubeIcon,
} from '@yuki/ui/icons'
import { Input } from '@yuki/ui/input'

export const Footer = () => (
  <footer className='border-t bg-card py-12 text-card-foreground'>
    <div className='container grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
      <div className='space-y-4'>
        <Link href='/' className='inline-block text-2xl font-bold'>
          Yukinu
        </Link>
        <p className='max-w-xs text-sm text-muted-foreground'>
          Your complete e-commerce destination for shopping online with a wide
          selection of products, easy checkout, and secure payments.{' '}
        </p>
        <div className='flex space-x-4'>
          {[
            { Icon: FacebookIcon, name: 'Facebook', href: '#' },
            { Icon: InstagramIcon, name: 'Instagram', href: '#' },
            { Icon: XFormerTwitterIcon, name: 'Twitter', href: '#' },
            { Icon: YoutubeIcon, name: 'YouTube', href: '#' },
          ].map(({ Icon, name, href }) => (
            <a
              key={name}
              href={href}
              className='text-muted-foreground transition-colors hover:text-foreground'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Icon className='h-5 w-5' />
              <span className='sr-only'>{name}</span>
            </a>
          ))}
        </div>
      </div>

      <div className='space-y-4'>
        <p className='text-sm font-medium tracking-wider uppercase'>
          Quick Links
        </p>
        <ul className='space-y-2'>
          {[
            { href: '/home', text: 'Home' },
            { href: '/about', text: 'About Us' },
            { href: '/contact', text: 'Contact Us' },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className='text-sm text-muted-foreground transition-colors hover:text-foreground'
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className='space-y-4'>
        <p className='text-sm font-medium tracking-wider uppercase'>
          Customer Service
        </p>
        <ul className='space-y-2'>
          {[
            { href: '/faq', text: 'FAQ' },
            { href: '/shipping', text: 'Shipping & Delivery' },
            { href: '/returns', text: 'Returns & Exchanges' },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className='text-sm text-muted-foreground transition-colors hover:text-foreground'
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className='space-y-4 lg:row-span-2'>
        <p className='text-sm font-medium tracking-wider uppercase'>
          Stay Updated
        </p>
        <p className='text-sm text-muted-foreground'>
          Subscribe to our newsletter for exclusive offers and updates.
        </p>
        <form className='flex space-x-2'>
          <Input
            type='email'
            placeholder='Your email'
            className='max-w-[220px]'
            aria-label='Email for newsletter'
          />
          <Button type='submit' size='sm'>
            Subscribe
          </Button>
        </form>
        <div className='space-y-2 pt-2'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <MapPinIcon className='h-4 w-4' />
            <span>123 Skibidi Street, Tralalero, Tralalala</span>
          </div>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <MailIcon className='h-4 w-4' />
            <span>support@yuki.com</span>
          </div>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <PhoneIcon className='h-4 w-4' />
            <span>+1 (234) 567-8900</span>
          </div>
        </div>
      </div>

      <Alert className='md:col-span-2 lg:col-span-3'>
        <AlertTitle>Development Notice</AlertTitle>
        <AlertDescription>
          This is a personal portfolio project for demonstration purposes only.
          No actual products are sold.
        </AlertDescription>
      </Alert>
    </div>

    <hr className='my-8' />

    <div className='container flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0'>
      <div className='text-sm text-muted-foreground'>
        &copy; {new Date().getFullYear()} Yukinu Inc. All rights reserved.
      </div>
      <div className='flex space-x-6'>
        {[
          { href: '/terms', text: 'Terms of Service' },
          { href: '/privacy', text: 'Privacy Policy' },
          { href: '/cookie', text: 'Cookie Policy' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className='text-sm text-muted-foreground transition-colors hover:text-foreground'
          >
            {link.text}
          </Link>
        ))}
      </div>
    </div>
  </footer>
)
