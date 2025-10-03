import Image from 'next/image'
import Link from 'next/link'

import { UserButton } from '@/app/(main)/_components/header/user-button'

export const Header: React.FC = () => {
  return (
    <header className='sticky inset-0 z-50 flex h-14 items-center border-b border-sidebar-border bg-sidebar/70 backdrop-blur-xl backdrop-saturate-150'>
      <div className='container flex items-center justify-between gap-4'>
        <Link href='/' className='flex items-center gap-2'>
          <Image
            src='/assets/images/logo.svg'
            alt='Logo'
            width={32}
            height={32}
            className='size-8 object-cover dark:invert'
            priority
          />
          <span className='sr-only text-xl font-semibold md:not-sr-only'>
            Yukinu
          </span>
        </Link>

        <UserButton />
      </div>
    </header>
  )
}
