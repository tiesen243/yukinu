import { useMutation } from '@tanstack/react-query'

import { useSession } from '@yukinu/auth/react'
import { useTheme } from '@yukinu/ui'
import { useMounted } from '@yukinu/ui/hooks/use-mounted'
import { HeadsetIcon, LogOutIcon, MoonIcon, SunIcon } from '@yukinu/ui/icons'
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@yukinu/ui/sidebar'

import { useTRPC } from '@/trpc/react'

export const AppSidebarFooter: React.FC = () => {
  return (
    <SidebarFooter className='border-t border-sidebar-border'>
      <SidebarMenu>
        <SidebarMenuItem>
          <ToggleThemeButton />
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton>
            <HeadsetIcon /> Contact Support
          </SidebarMenuButton>
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
  const { status, refresh } = useSession()

  const trpc = useTRPC()
  const { mutate } = useMutation({
    ...trpc.auth.logout.mutationOptions(),
    onSuccess: async () => {
      await refresh()
    },
  })

  if (status === 'loading')
    return (
      <SidebarMenuButton className='animate-pulse bg-sidebar-accent'>
        &nbsp;
      </SidebarMenuButton>
    )

  if (status !== 'authenticated') return null

  return (
    <SidebarMenuButton
      role='button'
      onClick={() => {
        mutate()
      }}
    >
      <LogOutIcon /> Logout
    </SidebarMenuButton>
  )
}
