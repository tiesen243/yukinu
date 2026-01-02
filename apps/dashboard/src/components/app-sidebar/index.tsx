import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@yukinu/ui/sidebar'

import { AppSidebarContent } from '@/components/app-sidebar/content'
import { UserButton } from '@/components/app-sidebar/user-button'

export const AppSidebar: React.FC<React.ComponentProps<typeof Sidebar>> = (
  props,
) => {
  return (
    <Sidebar {...props}>
      <SidebarHeader className='flex-row items-center gap-2 border-b'>
        <div className='flex size-8 items-center justify-center rounded-md bg-foreground'>
          <img src='/favicon.svg' alt='Yukinu Logo' className='size-6 invert' />
        </div>
        <span className='text-lg font-bold'>Yukinu</span>
      </SidebarHeader>
      <SidebarContent>
        <AppSidebarContent />
      </SidebarContent>

      <SidebarFooter>
        <UserButton />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
