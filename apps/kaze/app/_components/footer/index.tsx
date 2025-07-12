import Link from 'next/link'

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
  <footer className="bg-card text-card-foreground border-t py-12">
    <div className="container grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-4">
        <Link href="/" className="inline-block">
          <h2 className="text-2xl font-bold">Yukinu</h2>
        </Link>
        <p className="text-muted-foreground max-w-xs text-sm">
          Your complete e-commerce destination for shopping online with a wide
          selection of products, easy checkout, and secure payments.{' '}
        </p>
        <div className="flex space-x-4">
          {[
            { Icon: FacebookIcon, name: 'Facebook', href: '#' },
            { Icon: InstagramIcon, name: 'Instagram', href: '#' },
            { Icon: XFormerTwitterIcon, name: 'Twitter', href: '#' },
            { Icon: YoutubeIcon, name: 'YouTube', href: '#' },
          ].map(({ Icon, name, href }) => (
            <a
              key={name}
              href={href}
              className="text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon className="h-5 w-5" />
              <span className="sr-only">{name}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium tracking-wider uppercase">
          Quick Links
        </h3>
        <ul className="space-y-2">
          {[
            { href: '/home', text: 'Home' },
            { href: '/about', text: 'About Us' },
            { href: '/contact', text: 'Contact Us' },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium tracking-wider uppercase">
          Customer Service
        </h3>
        <ul className="space-y-2">
          {[
            { href: '/faq', text: 'FAQ' },
            { href: '/shipping', text: 'Shipping & Delivery' },
            { href: '/returns', text: 'Returns & Exchanges' },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium tracking-wider uppercase">
          Stay Updated
        </h3>
        <p className="text-muted-foreground text-sm">
          Subscribe to our newsletter for exclusive offers and updates.
        </p>
        <form className="flex space-x-2">
          <Input
            type="email"
            placeholder="Your email"
            className="max-w-[220px]"
            aria-label="Email for newsletter"
          />
          <Button type="submit" size="sm">
            Subscribe
          </Button>
        </form>
        <div className="space-y-2 pt-2">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <MapPinIcon className="h-4 w-4" />
            <span>123 Skibidi Street, Tralalero, Tralalala</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <MailIcon className="h-4 w-4" />
            <span>support@yuki.com</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <PhoneIcon className="h-4 w-4" />
            <span>+1 (234) 567-8900</span>
          </div>
        </div>
      </div>
    </div>

    <hr className="my-8" />

    <div className="container flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
      <div className="text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} Yukinu Inc. All rights reserved.
      </div>
      <div className="flex space-x-6">
        {[
          { href: '/terms', text: 'Terms of Service' },
          { href: '/policy', text: 'Privacy Policy' },
          { href: '/cookie', text: 'Cookie Policy' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            {link.text}
          </Link>
        ))}
      </div>
    </div>
  </footer>
)
