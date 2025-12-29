import { cn } from '@yukinu/ui'
import { TextInput } from 'react-native'
import { useUniwind } from 'uniwind'

function Input({
  className,
  ...props
}: React.ComponentProps<typeof TextInput>) {
  const { theme } = useUniwind()

  return (
    <TextInput
      data-slot='input'
      className={cn(
        'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base text-foreground transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
        className,
      )}
      placeholderTextColor={theme === 'dark' ? '#a4a4a4' : '#525252'}
      {...props}
    />
  )
}

export { Input }
