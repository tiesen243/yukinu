import { Sidebar, SidebarRail } from '@yukinu/ui/sidebar'

import { AppSidebarContent } from '@/components/app-sidebar/content'
import { AppSidebarFooter } from '@/components/app-sidebar/footer'
import { AppSidebarHeader } from '@/components/app-sidebar/header'

export const AppSidebar: React.FC<React.ComponentProps<typeof Sidebar>> = ({
  ...props
}) => {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <AppSidebarHeader />
      <AppSidebarContent />
      <AppSidebarFooter />
      <SidebarRail />
    </Sidebar>
  )
}
