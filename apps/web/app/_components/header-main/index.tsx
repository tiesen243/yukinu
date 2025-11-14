import { Brand } from '@/app/_components/brand'
import { SearchBox } from '@/app/_components/header-main/search-box'
import { UserButton } from '@/app/_components/header-main/user-button'

export const Header: React.FC = () => {
  return (
    <header className='sticky inset-0 z-50 border-b bg-card/60 backdrop-blur-xl backdrop-saturate-150'>
      <div className='container flex h-14 items-center gap-4'>
        <Brand
          containerClassName='md:basis-1/6'
          logoContainerClassName='size-9'
          logoClassName='size-7'
          titleClassName='sr-only md:not-sr-only'
        />

        <SearchBox />

        <UserButton />
      </div>
    </header>
  )
}
