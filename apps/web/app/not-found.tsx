'use client'

import Image from 'next/image'
import Link from 'next/link'

import { buttonVariants } from '@yukinu/ui/button'
import { Typography } from '@yukinu/ui/typography'

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

      <Typography variant='h2' className='text-center'>
        404 - Page Not Found
      </Typography>

      <Typography className='text-center text-muted-foreground'>
        Sorry, the page you are looking for does not exist.
      </Typography>

      <Link href='/' className={buttonVariants({ size: 'lg' })}>
        Take me home
      </Link>
    </main>
  )
}
