import type { LucideIcon } from '@yukinu/ui/icons'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@yukinu/ui/sidebar'
import { Link, useMatch, useResolvedPath } from 'react-router'

export const NavMain: React.FC<{
  items: { title: string; url: string; icon?: LucideIcon }[]
}> = ({ items }) => (
  <SidebarGroup>
    <SidebarGroupContent className='flex flex-col gap-2'>
      <SidebarMenu>
        {items.map((item) => {
          const resolved = useResolvedPath(item.url)
          const match = useMatch({ path: resolved.pathname, end: true })

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={!!match}
                render={<Link to={item.url} />}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
)
