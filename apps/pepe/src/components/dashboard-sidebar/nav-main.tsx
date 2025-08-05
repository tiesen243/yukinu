import { NavLink } from 'react-router'

import { Loader2Icon } from '@yuki/ui/icons'
import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@yuki/ui/sidebar'

export const NavMain: React.FC<{
  isAdmin: boolean
  navigation: {
    name: string
    href: string
    icon: React.ComponentType
  }[]
}> = ({ isAdmin, navigation }) => {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          {navigation.map((item) =>
            item.href.startsWith('/admin') && !isAdmin ? null : (
              <SidebarMenuItem key={item.name}>
                <NavLink to={item.href}>
                  {({ isActive, isPending }) => (
                    <SidebarMenuButton isActive={isActive}>
                      <item.icon />
                      {item.name}
                      {isPending && <Loader2Icon className='animate-spin' />}
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            ),
          )}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  )
}
