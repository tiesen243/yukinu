import { SidebarTrigger } from '@yukinu/ui/sidebar'

import { User } from '@/components/header/user'

export const Header: React.FC = () => {
  return (
    <header className='flex h-16 items-center justify-between gap-4 border-b bg-sidebar px-4'>
      <div className='flex items-center gap-4'>
        <SidebarTrigger />
        <span className='text-xl font-medium'>Dashboard</span>
      </div>

      <User />
    </header>
  )
}
