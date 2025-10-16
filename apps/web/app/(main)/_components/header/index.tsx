import Image from 'next/image'
import Link from 'next/link'

import { SearchBox } from '@/app/(main)/_components/header/search-box'
import { UserButton } from '@/app/(main)/_components/header/user-button'

export const Header: React.FC = () => {
  return (
    <header className='sticky inset-0 z-50 border-b bg-background/60 backdrop-blur-xl backdrop-saturate-150'>
      <div className='container flex h-14 items-center gap-4'>
        <Link href='/' className='flex items-center gap-2 sm:basis-1/6'>
          <Image
            src='/assets/logo.svg'
            alt='Logo'
            width={28}
            height={28}
            className='dark:invert'
          />
          <span className='sr-only text-2xl font-bold sm:not-sr-only'>
            Yukinu
          </span>
        </Link>

        <SearchBox />

        <UserButton />
      </div>
    </header>
  )
}
