'use client'

import { CopyrightIcon } from '@yukinu/ui/icons'
import { env } from '@yukinu/validators/env'

export function Copyright() {
  return (
    <p className='flex items-center gap-1 [&_svg]:size-4'>
      <CopyrightIcon /> {new Date().getFullYear()} {env.NEXT_PUBLIC_APP_NAME}.
      All rights reserved.
    </p>
  )
}

export function CopyrightSkeleton() {
  return (
    <p className='flex items-center gap-1 [&_svg]:size-4'>
      <CopyrightIcon /> 0000 {env.NEXT_PUBLIC_APP_NAME}. All rights reserved.
    </p>
  )
}
