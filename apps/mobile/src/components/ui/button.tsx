import type { ButtonVariants } from '@yukinu/ui/button'

import { cn } from '@yukinu/ui'
import { buttonVariants } from '@yukinu/ui/button'
import { Pressable } from 'react-native'

import { TextClassContext } from '@/components/ui/text'

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  ButtonVariants

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider
      value={cn('font-[GeistMedium] text-sm text-foreground', {
        'text-primary-foreground': variant === 'default',
        'text-foreground': variant === 'outline' || variant === 'ghost',
        'text-secondary-foreground': variant === 'secondary',
        'text-success': variant === 'success',
        'text-destructive': variant === 'destructive',
        'text-info': variant === 'info',
        'text-warning': variant === 'warning',
        'text-primary underline': variant === 'link',
      })}
    >
      <Pressable
        className={cn(
          props.disabled && 'opacity-50',
          buttonVariants({ variant, size }),
          className,
        )}
        role='button'
        {...props}
      />
    </TextClassContext.Provider>
  )
}

export { Button }
export type { ButtonProps }
