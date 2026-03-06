import type { VariantProps } from '@yukinu/ui'

import { cn, cva } from '@yukinu/ui'
import { buttonVariants } from '@yukinu/ui/button'
import { TouchableOpacity } from 'react-native'

import { TextProvider } from '@/components/ui/text'

const buttonTextVariants = cva(
  'web:select-none my-0 text-sm font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        outline: 'text-foreground',
        secondary: 'text-secondary-foreground',
        ghost: 'text-foreground',
        success: 'text-success',
        destructive: 'text-destructive',
        info: 'text-info',
        warning: 'text-warning',
        link: 'text-primary',
      },
    },

    defaultVariants: {
      variant: 'default',
    },
  },
)

interface ButtonProps
  extends
    React.ComponentProps<typeof TouchableOpacity>,
    VariantProps<typeof buttonVariants> {}

function Button({
  className = '',
  variant = 'default',
  size = 'default',
  activeOpacity = 0.8,
  ...props
}: ButtonProps) {
  return (
    <TextProvider
      className={cn(buttonTextVariants({ variant }), {
        'text-xs': size === 'xs',
      })}
    >
      <TouchableOpacity
        data-slot='button'
        className={cn(buttonVariants({ variant, size }), className)}
        activeOpacity={activeOpacity}
        {...props}
      />
    </TextProvider>
  )
}

export { Button }
