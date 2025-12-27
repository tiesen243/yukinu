import { Typography } from '@yukinu/ui/typography'

const links = [
  {
    href: 'https://tiesen243.github.io/yukinu/legal/term-of-service.html',
    label: 'Terms of Service',
  },
  {
    href: 'https://tiesen243.github.io/yukinu/legal/privacy-policy.html',
    label: 'Privacy Policy',
  },
  {
    href: 'https://tiesen243.github.io/yukinu/legal/cookie.html',
    label: 'Cookie Policy',
  },
  {
    href: 'https://tiesen243.github.io/yukinu/legal/disclaimer.html',
    label: 'Disclaimer',
  },
  {
    href: 'https://tiesen243.github.io/yukinu/legal/dmca.html',
    label: 'DMCA Policy',
  },
]

export const LegalLinks: React.FC = () => (
  <nav>
    <Typography variant='h6' className='mt-0' render={<p>Legal</p>} />

    <ul className='space-y-1 text-sm'>
      {links.map((link) => (
        <li key={link.href}>
          {/* oxlint-disable-next-line no-html-link-for-pages */}
          <a
            href={link.href}
            className='hover:underline'
            target='_blank'
            rel='noopener noreferrer'
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
)
