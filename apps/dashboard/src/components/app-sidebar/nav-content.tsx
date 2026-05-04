import type { LucideIcon } from '@yukinu/ui/icons'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@yukinu/ui/sidebar'
import { Link, useMatch, useResolvedPath } from 'react-router'

export const NavContent: React.FC<{
  label: string
  items: { name: string; url: string; icon: LucideIcon }[]
}> = ({ label, items }) => (
  <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
    <SidebarGroupLabel>{label}</SidebarGroupLabel>
    <SidebarMenu>
      {items.map((item) => {
        const resolved = useResolvedPath(item.url)
        const match = useMatch({ path: resolved.pathname, end: true })

        return (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              isActive={!!match}
              render={<Link to={item.url} />}
            >
              <item.icon />
              <span>{item.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  </SidebarGroup>
)
