import { cn } from '@yukinu/ui'
import { buttonVariants } from '@yukinu/ui/button'
import { Pressable, Text } from 'react-native'

type Variants = Parameters<typeof buttonVariants>[0]

function Button({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof Pressable> & Variants) {
  const textColors = {
    default: 'text-primary-foreground',
    secondary: 'text-secondary-foreground',
    success: 'text-success',
    destructive: 'text-destructive',
    info: 'text-info',
    warning: 'text-warning',
    outline: 'text-foreground',
    ghost: 'text-foreground',
    link: 'text-primary',
  } as const

  return (
    <Pressable
      {...props}
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
    >
      {typeof children === 'string' ? (
        <Text
          data-slot='button-text'
          className={textColors[variant ?? 'default']}
          style={{ fontFamily: 'Geist_500Medium' }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  )
}

export { Button }
