import { useNavigate } from 'react-router'

import { useSession } from '@yukinu/auth/react'
import { useTheme } from '@yukinu/ui'
import { useMounted } from '@yukinu/ui/hooks/use-mounted'
import { LogOutIcon, MoonIcon, SunIcon } from '@yukinu/ui/icons'
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@yukinu/ui/sidebar'

export const AppSidebarFooter: React.FC = () => {
  return (
    <SidebarFooter className='border-t border-sidebar-border'>
      <SidebarMenu>
        <SidebarMenuItem>
          <ToggleThemeButton />
        </SidebarMenuItem>

        <SidebarMenuItem>
          <LogOutButton />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}

const ToggleThemeButton: React.FC = () => {
  const { theme, setTheme } = useTheme()

  const isMounted = useMounted()
  if (!isMounted)
    return (
      <SidebarMenuButton className='animate-pulse bg-sidebar-accent'>
        &nbsp;
      </SidebarMenuButton>
    )

  return (
    <SidebarMenuButton
      role='button'
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light')
      }}
    >
      {theme === 'light' ? <SunIcon /> : <MoonIcon />}
      {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
    </SidebarMenuButton>
  )
}

const LogOutButton: React.FC = () => {
  const { signOut } = useSession()
  const navigate = useNavigate()

  return (
    <SidebarMenuButton
      role='button'
      onClick={async () => {
        await signOut()
        await navigate('/web')
      }}
    >
      <LogOutIcon /> Logout
    </SidebarMenuButton>
  )
}
