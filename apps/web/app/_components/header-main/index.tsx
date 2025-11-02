import { Brand } from '@/app/_components/brand'
import { SearchBox } from '@/app/_components/header-main/search-box'
import { UserButton } from '@/app/_components/header-main/user-button'

export const Header: React.FC = () => {
  return (
    <header className='sticky inset-0 z-50 border-b bg-background/60 backdrop-blur-xl backdrop-saturate-150'>
      <div className='container flex h-14 items-center gap-4'>
        <Brand
          containerClassName='sm:basis-1/6'
          titleClassName='sr-only sm:not-sr-only'
        />

        <SearchBox />

        <UserButton />
      </div>
    </header>
  )
}
