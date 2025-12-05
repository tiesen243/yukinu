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
    <h3 className='mb-2 text-base font-semibold'>Legal</h3>
    <ul className='space-y-1 text-sm'>
      {links.map((link) => (
        <li key={link.href}>
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
