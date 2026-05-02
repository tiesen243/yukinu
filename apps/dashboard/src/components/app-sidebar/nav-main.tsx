import type { LucideIcon } from '@yukinu/ui/icons'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@yukinu/ui/sidebar'
import { NavLink } from 'react-router'

export const NavMain: React.FC<{
  items: { title: string; url: string; icon?: LucideIcon }[]
}> = ({ items }) => (
  <SidebarGroup>
    <SidebarGroupContent className='flex flex-col gap-2'>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <NavLink to={item.url}>
              {({ isActive }) => (
                <SidebarMenuButton isActive={isActive}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
)
