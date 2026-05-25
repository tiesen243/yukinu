import { Typography } from '@yukinu/ui/typography'
import Link from 'next/link'

const links = [
  { href: '/home', label: 'Home' },
  { href: '/search', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const

export const QuickLinks: React.FC = () => (
  <nav>
    <Typography variant='h4' as='p'>
      Quick Links
    </Typography>

    <ul className='space-y-1 text-sm'>
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className='hover:underline'>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
)
