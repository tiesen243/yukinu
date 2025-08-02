import * as React from 'react'

import { useTheme } from '@yuki/ui'
import { Button } from '@yuki/ui/button'
import { useIsMounted } from '@yuki/ui/hooks/use-is-mounted'
import { MoonIcon, SunIcon } from '@yuki/ui/icons'

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()

  const isMounted = useIsMounted()
  if (!isMounted) return

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
      }}
    >
      {resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
      <span className='sr-only'>
        Toggle {resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode
      </span>
    </Button>
  )
}
