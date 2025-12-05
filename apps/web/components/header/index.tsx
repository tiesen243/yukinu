import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { env } from '@yukinu/validators/env.next'

import { SearchForm } from '@/components/header/search-form'
import { UserButton } from '@/components/header/user-button'

export function Header() {
  return (
    <header className='sticky inset-0 z-50 flex h-14 items-center border-b bg-popover/60 text-popover-foreground backdrop-blur-xl backdrop-saturate-150'>
      <nav className='container flex items-center justify-between gap-4'>
        <Link href='/' className='flex items-center gap-2'>
          <Image
            src='/assets/logo.svg'
            alt={`${env.NEXT_PUBLIC_APP_NAME} Logo`}
            width={36}
            height={36}
            className='dark:invert'
          />
          <span className='sr-only text-lg font-bold md:not-sr-only'>
            {env.NEXT_PUBLIC_APP_NAME}
          </span>
        </Link>

        <Suspense fallback={null}>
          <SearchForm />
        </Suspense>

        <UserButton />
      </nav>
    </header>
  )
}
