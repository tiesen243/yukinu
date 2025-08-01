import { useTheme } from '@yuki/ui'
import { Button } from '@yuki/ui/button'
import { MoonIcon, SunIcon } from '@yuki/ui/icons'

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()

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
