import type { LucideIcon } from '@yukinu/ui/icons'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@yukinu/ui/sidebar'
import * as React from 'react'
import { NavLink, useMatch, useResolvedPath } from 'react-router'

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
        {items.map((item) => {
          const resolved = useResolvedPath(item.url)
          const match = useMatch({ path: resolved.pathname, end: true })

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={!!match}
                render={<NavLink to={item.url} />}
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
)
