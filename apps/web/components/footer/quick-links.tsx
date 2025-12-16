import Link from 'next/link'

import { Typography } from '@yukinu/ui/typography'

const links = [
  { href: '/home', label: 'Home', isExternal: false },
  { href: '/search', label: 'Shop', isExternal: false },
  { href: '/about', label: 'About', isExternal: false },
  { href: '/contact', label: 'Contact', isExternal: false },
  {
    href: 'https://tiesen243.github.io/yukinu/legal/faq.html',
    label: 'FAQ',
    isExternal: true,
  },
] as const

export const QuickLinks: React.FC = () => (
  <nav>
    <Typography variant='h6' className='mt-0' render={<p>Quick Links</p>} />

    <ul className='space-y-1 text-sm'>
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className='hover:underline'
            target={link.isExternal ? '_blank' : '_self'}
            rel={link.isExternal ? 'noopener noreferrer' : undefined}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
)
