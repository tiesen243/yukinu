import { cn } from '@yukinu/ui'
import { ChevronRightIcon } from '@yukinu/ui/icons'
import * as React from 'react'
import { Link, useLocation } from 'react-router'

const CUID_LENGTH = 24

export const Breadcrumb = () => {
  const location = useLocation()

  return (
    <nav className='flex items-center gap-2 overflow-hidden text-sm'>
      <Link
        to='/'
        className={
          location.pathname === '/'
            ? 'text-foreground'
            : 'text-muted-foreground transition-colors hover:text-foreground'
        }
      >
        Dashboard
      </Link>
      {location.pathname !== '/' && (
        <ChevronRightIcon className='size-4 opacity-90' />
      )}

      {location.pathname.split('/').map((segment, index, array) => {
        if (segment === '') return null

        const path = '/' + array.slice(1, index + 1).join('/')

        return (
          <React.Fragment key={path}>
            <Link
              to={path}
              className={cn(
                segment.length !== CUID_LENGTH && 'capitalize',
                index === array.length - 1
                  ? 'text-foreground'
                  : 'text-muted-foreground transition-colors hover:text-foreground',
              )}
            >
              {segment.replaceAll('-', ' ')}
            </Link>
            {index < array.length - 1 && (
              <ChevronRightIcon className='size-4 opacity-90' />
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
