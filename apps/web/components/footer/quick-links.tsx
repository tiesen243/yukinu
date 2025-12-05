import Link from 'next/link'

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
]

export const QuickLinks: React.FC = () => (
  <nav>
    <h3 className='mb-2 text-base font-semibold'>Quick Links</h3>
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
