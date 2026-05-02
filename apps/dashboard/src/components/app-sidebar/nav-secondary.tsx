import type { LucideIcon } from '@yukinu/ui/icons'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@yukinu/ui/sidebar'
import * as React from 'react'
import { NavLink } from 'react-router'

export const NavSecondary: React.FC<
  {
    items: {
      title: string
      url: string
      icon: LucideIcon
    }[]
  } & React.ComponentPropsWithoutRef<typeof SidebarGroup>
> = ({ items, ...props }) => (
  <SidebarGroup {...props}>
    <SidebarGroupContent>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <NavLink to={item.url}>
              {({ isActive }) => (
                <SidebarMenuButton isActive={isActive}>
                  <item.icon />
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
