import * as React from 'react'
import { Link, useLocation } from 'react-router'

import { ChevronRightIcon } from '@yuki/ui/icons'

export const Breadcrumb = () => {
  const { pathname } = useLocation()

  const breadcrumbs = React.useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)

    const breadcrumbs = [{ label: 'Home', href: '/', isHome: true }]

    let currentPath = ''
    segments.forEach((segment) => {
      currentPath += `/${segment}`
      breadcrumbs.push({
        label: (segment.charAt(0).toUpperCase() + segment.slice(1)).replaceAll(
          '-',
          ' ',
        ),
        href: currentPath,
        isHome: false,
      })
    })
    return breadcrumbs
  }, [pathname])

  return (
    <nav className='flex grow items-center gap-1 text-sm'>
      {breadcrumbs.map((breadcrumb, index) => (
        <div
          key={breadcrumb.href}
          className='flex items-center text-muted-foreground'
        >
          {index > 0 && <ChevronRightIcon className='mx-1 size-4' />}

          <Link
            to={breadcrumb.href}
            className='transition-colors hover:text-foreground'
          >
            {breadcrumb.isHome ? '~' : breadcrumb.label}
          </Link>
        </div>
      ))}
    </nav>
  )
}
