'use client'

import Image from 'next/image'
import Link from 'next/link'

import { buttonVariants } from '@yukinu/ui/button'

export default function DocsNotFoundError() {
  return (
    <main className='container flex min-h-[calc(100dvh-1.5rem)] flex-col items-center justify-center gap-8'>
      <Image
        src='/assets/images/yuki.webp'
        alt='Yuki Not Found'
        width={500}
        height={500}
        priority
      />

      <h1 className='text-center text-4xl font-bold text-balance'>
        404 - Page Not Found
      </h1>

      <p className='text-center text-lg text-pretty text-muted-foreground'>
        Sorry, the page you are looking for does not exist.
      </p>

      <Link href='/' className={buttonVariants({ size: 'lg' })}>
        Take me home
      </Link>
    </main>
  )
}
