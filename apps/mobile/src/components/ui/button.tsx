import type { VariantProps } from '@yukinu/ui'

import { cn, cva } from '@yukinu/ui'
import { buttonVariants } from '@yukinu/ui/button'
import { Pressable } from 'react-native'

import { TextProvider } from '@/components/ui/text'

const buttonActiveVariants = cva('', {
  variants: {
    variant: {
      default: 'active:bg-primary/80',
      outline: 'active:bg-muted active:hover:bg-input/50',
      secondary: 'active:bg-secondary/80',
      ghost: 'active:bg-muted active:hover:bg-muted/50',
      success: 'active:bg-success/20 dark:active:bg-success/30',
      destructive: 'active:bg-destructive/20 dark:active:bg-destructive/30',
      info: 'active:bg-info/20 dark:active:bg-info/30',
      warning: 'active:bg-warning/20 dark:active:bg-warning/30',
      link: '',
    },
  },

  defaultVariants: {
    variant: 'default',
  },
})

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
        link: 'text-primary underline-offset-4',
      },
    },

    defaultVariants: {
      variant: 'default',
    },
  },
)

interface ButtonProps
  extends
    React.ComponentProps<typeof Pressable>,
    VariantProps<typeof buttonVariants> {}

function Button({
  variant = 'default',
  size = 'default',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      data-slot='button'
      className={cn(
        buttonVariants({ variant, size }),
        buttonActiveVariants({ variant }),
        className,
      )}
      {...props}
    >
      {(state) => (
        <TextProvider
          className={cn(buttonTextVariants({ variant }), {
            'text-xs': size === 'xs',
            underline: variant === 'link' && state.pressed,
          })}
        >
          {typeof children === 'function' ? children(state) : children}
        </TextProvider>
      )}
    </Pressable>
  )
}

export { Button }
