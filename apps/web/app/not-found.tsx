'use client'

import { Button } from '@yukinu/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function DocsNotFoundError() {
  return (
    <main className='container flex min-h-dvh flex-col items-center justify-center gap-6'>
      <Image
        src='/assets/images/yuki.webp'
        alt='Mascot'
        width={192}
        height={192}
        className='size-48 object-cover select-none'
        draggable={false}
        priority
      />

      <div className='flex items-center gap-4'>
        <h1 className='text-2xl font-bold'>404</h1>
        <hr className='h-9 w-0.5 bg-muted' />
        <p className='text-lg font-medium'>Page Not Found</p>
      </div>

      <Button
        size='sm'
        nativeButton={false}
        render={<Link href='/'>Take me home</Link>}
      />
    </main>
  )
}
