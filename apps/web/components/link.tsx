'use client'

import type { LinkProps } from 'next/link'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'

function Link({ href, ...props }: LinkProps<unknown>) {
  const router = useRouter()

  return (
    <NextLink
      data-slot='link'
      href={href}
      prefetch={false}
      onMouseEnter={() => router.prefetch(href as never)}
      {...props}
    />
  )
}

export { Link }
