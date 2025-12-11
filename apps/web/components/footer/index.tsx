import Image from 'next/image'
import Link from 'next/link'

import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  XFormerTwitterIcon,
} from '@yukinu/ui/icons'
import { env } from '@yukinu/validators/env.next'

import { LegalLinks } from '@/components/footer/legal-links'
import { Newsletter } from '@/components/footer/newsletter'
import { QuickLinks } from '@/components/footer/quick-links'

export function Footer() {
  return (
    <footer className='border-t bg-popover py-8 text-popover-foreground'>
      <div className='container grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <div className='md:col-span-2 lg:col-span-1'>
          <Link href='/' className='flex items-center gap-2'>
            <div className='flex size-9 items-center justify-center rounded-lg bg-accent'>
              <Image
                src='/assets/logo.svg'
                alt='Yukinu Logo'
                width={28}
                height={28}
                className='dark:invert'
              />
            </div>
            <span className='text-lg font-bold'>
              {env.NEXT_PUBLIC_APP_NAME}
            </span>
          </Link>

          <p className='my-4 text-sm text-muted-foreground'>
            An e-commerce platform that enables customers to discover, compare,
            and purchase products from multiple sellers in one place, with fast
            browsing, secure checkout, and a smooth user experience
          </p>

          <div className='flex flex-wrap items-center gap-4 [&_svg]:size-5 [&_svg]:transition-colors [&_svg]:hover:text-accent-foreground'>
            <GithubIcon />
            <FacebookIcon />
            <InstagramIcon />
            <XFormerTwitterIcon />
          </div>
        </div>

        <QuickLinks />

        <LegalLinks />

        <Newsletter />
      </div>

      <hr className='container my-6 border-t' />

      <div className='container text-center text-sm'>
        © {new Date().getFullYear()} {env.NEXT_PUBLIC_APP_NAME}. All rights
        reserved.
      </div>
    </footer>
  )
}
