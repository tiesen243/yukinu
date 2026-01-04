'use client'

import { Button } from '@yukinu/ui/button'
import Image from 'next/image'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error }: Readonly<ErrorProps>) {
  return (
    <main className='container flex min-h-dvh flex-col items-center justify-center gap-6'>
      <Image
        src='/assets/yuki.webp'
        alt='Mascot'
        width={192}
        height={192}
        className='size-48 object-cover select-none'
        draggable={false}
        priority
      />

      <div className='flex items-center gap-4'>
        <h1 className='text-2xl font-bold'>Opps!</h1>
        <hr className='h-9 w-0.5 bg-muted' />
        <p className='text-lg font-medium'>{error.message}</p>
      </div>

      <Button
        size='sm'
        nativeButton={false}
        render={<Link href='/'>Take me home</Link>}
      />

      {
        // oxlint-disable-next-line no-process-env
        process.env.NODE_ENV === 'development' && (
          <pre className='w-full overflow-x-auto p-4'>
            <code>{error.stack}</code>
          </pre>
        )
      }
    </main>
  )
}
