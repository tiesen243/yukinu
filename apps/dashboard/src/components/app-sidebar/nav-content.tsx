import type { LucideIcon } from '@yukinu/ui/icons'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@yukinu/ui/sidebar'
import { NavLink } from 'react-router'

export const NavContent: React.FC<{
  label: string
  items: { name: string; url: string; icon: LucideIcon }[]
}> = ({ label, items }) => (
  <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
    <SidebarGroupLabel>{label}</SidebarGroupLabel>
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.name}>
          <NavLink to={item.url}>
            {({ isActive }) => (
              <SidebarMenuButton isActive={isActive}>
                <item.icon />
                <span>{item.name}</span>
              </SidebarMenuButton>
            )}
          </NavLink>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  </SidebarGroup>
)
