import { useTheme } from '@yukinu/ui'
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@yukinu/ui/dropdown-menu'
import {
  CheckIcon,
  ContrastIcon,
  LaptopIcon,
  MoonIcon,
  SunIcon,
} from '@yukinu/ui/icons'

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <ContrastIcon /> Display
      </DropdownMenuSubTrigger>

      <DropdownMenuSubContent>
        <DropdownMenuItem
          onSelect={() => {
            setTheme('light')
          }}
        >
          <SunIcon /> Light {theme === 'light' && <CheckIcon />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            setTheme('dark')
          }}
        >
          <MoonIcon /> Dark {theme === 'dark' && <CheckIcon />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            setTheme('system')
          }}
        >
          <LaptopIcon /> System {theme === 'system' && <CheckIcon />}
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}
