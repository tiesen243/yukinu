import { ChevronRightIcon } from '@yukinu/ui/icons'
import { Fragment } from 'react'
import { Link, useLocation } from 'react-router'

export const Breadcrumbs: React.FC = () => {
  const location = useLocation()

  const pathnames = location.pathname.split('/').filter(Boolean)

  return (
    <nav className='flex flex-1 items-center gap-1'>
      <Link to='/' className='hover:underline'>
        ~
      </Link>
      {pathnames.length > 0 && <ChevronRightIcon className='size-4' />}

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`

        return (
          <Fragment key={to}>
            <Link
              to={to}
              className={`capitalize hover:underline ${index === pathnames.length - 1 ? 'text-primary' : ''}`}
            >
              {value.replaceAll('-', ' ')}
            </Link>
            {index < pathnames.length - 1 && (
              <ChevronRightIcon className='size-4' />
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
