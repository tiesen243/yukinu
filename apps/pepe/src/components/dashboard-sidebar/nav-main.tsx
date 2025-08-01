import { Link, useLocation } from 'react-router'

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
    isAdmin: boolean
  }[]
}> = ({ isAdmin, navigation }) => {
  const { pathname } = useLocation()

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          {navigation.map((item) =>
            item.isAdmin && !isAdmin ? null : (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  isActive={
                    item.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(item.href)
                  }
                  asChild
                >
                  <Link to={item.href}>
                    <item.icon />
                    {item.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ),
          )}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  )
}
