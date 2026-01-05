import type { VariantProps } from '@yukinu/ui'
import type { Role } from 'react-native'

import { cn, cva } from '@yukinu/ui'
import * as React from 'react'
import { Platform, Text as RNText } from 'react-native'

const textVariants = cva(
  cn(
    'text-foreground text-base',
    Platform.select({
      web: 'select-text',
    }),
  ),
  {
    variants: {
      variant: {
        default: '',
        h1: cn(
          'text-4xl font-[GeistExtraBold] tracking-tight',
          Platform.select({ web: 'scroll-m-20 text-balance' }),
        ),
        h2: cn(
          'text-3xl font-[GeistBold] tracking-tight',
          Platform.select({ web: 'scroll-m-20 text-balance first:mt-0' }),
        ),
        h3: cn(
          'text-2xl font-[GeistSemiBold] tracking-tight',
          Platform.select({ web: 'scroll-m-20 text-balance' }),
        ),
        h4: cn(
          'text-xl font-[GeistSemiBold] tracking-tight',
          Platform.select({ web: 'scroll-m-20 text-balance' }),
        ),
        h5: cn(
          'text-lg font-[GeistMedium] tracking-tight',
          Platform.select({ web: 'scroll-m-20 text-balance' }),
        ),
        h6: cn(
          'text-base font-[GeistMedium] tracking-tight',
          Platform.select({ web: 'scroll-m-20 text-balance' }),
        ),
        p: cn(
          'font-[GeistRegular] leading-7',
          Platform.select({ web: ' text-pretty [&:not(:first-child)]:mt-2' }),
        ),
        blockquote: cn(
          'border-l-2 border-border pl-6 font-[GeistRegular] italic',
          Platform.select({
            web: 'before:content-["“"] after:content-["”"]',
          }),
        ),
        code: cn(
          'relative w-fit rounded-sm border border-accent bg-accent/40 px-[0.3rem] py-[0.2rem] text-sm font-[GeistMonoMedium] text-accent-foreground',
        ),
        caption: 'block text-sm tracking-wide',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type TextVariantProps = VariantProps<typeof textVariants>

type TextVariant = NonNullable<TextVariantProps['variant']>

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  blockquote: Platform.select({ web: 'blockquote' as Role }),
  code: Platform.select({ web: 'code' as Role }),
}

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: '1',
  h2: '2',
  h3: '3',
  h4: '4',
}

const TextClassContext = React.createContext<string | undefined>(undefined)

function Text({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof RNText> &
  TextVariantProps &
  React.RefAttributes<RNText>) {
  const textClass = React.useContext(TextClassContext)
  return (
    <RNText
      className={cn(textVariants({ variant }), textClass, className)}
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      {...props}
    />
  )
}

export { Text, TextClassContext }
