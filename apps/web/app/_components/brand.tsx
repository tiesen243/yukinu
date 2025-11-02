import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@yukinu/ui'
import { env } from '@yukinu/validators/env'

interface BrandProps {
  containerClassName?: string
  titleClassName?: string
}

export function Brand(props: BrandProps) {
  const { containerClassName = '', titleClassName = '' } = props

  return (
    <Link
      href='/'
      className={cn('flex items-center gap-2', containerClassName)}
    >
      <div className='flex size-8 items-center justify-center rounded-lg bg-accent'>
        <Image
          src='/assets/logo.svg'
          alt='Logo'
          width={24}
          height={24}
          className='size-6 object-cover dark:invert'
        />
      </div>
      <span className={cn('text-xl font-bold', titleClassName)}>
        {env.NEXT_PUBLIC_APP_NAME}
      </span>
    </Link>
  )
}
