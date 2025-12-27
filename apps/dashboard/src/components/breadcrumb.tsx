import { ChevronRightIcon } from '@yukinu/ui/icons'
import * as React from 'react'
import { Link, useLocation } from 'react-router'

const prettySegment = (segment: string) =>
  segment.replaceAll('-', ' ').replaceAll(/\b\w/g, (char) => char.toUpperCase())

export const Breadcrumb = () => {
  const location = useLocation()

  return (
    <nav className='flex items-center gap-2 text-sm'>
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
              className={
                index === array.length - 1
                  ? 'text-foreground'
                  : 'text-muted-foreground transition-colors hover:text-foreground'
              }
            >
              {prettySegment(segment)}
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
