import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@yukinu/ui'
import { env } from '@yukinu/validators/env'

interface BrandProps {
  containerClassName?: string
  logoContainerClassName?: string
  logoClassName?: string
  titleClassName?: string
}

export function Brand(props: BrandProps) {
  const {
    containerClassName = '',
    logoContainerClassName = '',
    logoClassName,
    titleClassName = '',
  } = props

  return (
    <Link
      href='/'
      className={cn('flex items-center gap-2', containerClassName)}
    >
      <div
        className={cn(
          'flex size-8 items-center justify-center rounded-lg bg-accent',
          logoContainerClassName,
        )}
      >
        <Image
          src='/assets/logo.svg'
          alt='Logo'
          width={24}
          height={24}
          className={cn('size-6 object-cover dark:invert', logoClassName)}
        />
      </div>
      <span className={cn('text-xl font-bold', titleClassName)}>
        {env.NEXT_PUBLIC_APP_NAME}
      </span>
    </Link>
  )
}
