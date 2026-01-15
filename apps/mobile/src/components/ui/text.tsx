import type { Role } from 'react-native'

import { cn } from '@yukinu/ui'
import * as React from 'react'
import { Platform, Text as RNText } from 'react-native'

const typographyVariants = {
  h1: 'my-8 scroll-m-20 text-4xl font-[GeistExtraBold] tracking-tight text-balance',
  h2: 'my-5 scroll-m-20 text-3xl font-[GeistBold] tracking-tight text-balance first:mt-0',
  h3: 'my-4 scroll-m-20 text-2xl font-[GeistSemiBold] tracking-tight text-balance',
  h4: 'my-3 scroll-m-20 text-xl font-[GeistSemiBold] tracking-tight text-balance',
  h5: 'my-2.5 scroll-m-20 text-lg font-[GeistMedium] tracking-tight text-balance',
  h6: 'my-2 scroll-m-20 text-base font-[GeistMedium] tracking-tight text-balance',
  p: 'leading-7 text-pretty font-[GeistRegular] [&:not(:first-child)]:mt-2',
  small: 'text-sm leading-none font-[GeistMedium]',
  ul: 'my-4 ml-6 list-disc text-base font-[GeistRegular] [&>li]:mt-2 [&>li]:first:mt-0',
  ol: 'my-4 ml-6 list-decimal text-base font-[GeistRegular] [&>li]:mt-2 [&>li]:first:mt-0',
  blockquote:
    'my-2 inline-flex border-l-2 pl-6 font-[GeistRegular] italic before:content-["“"] after:content-["”"]',
  code: 'relative w-fit rounded-sm border font-[GeistRegular] border-accent bg-accent/40 px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium text-accent-foreground',
  caption: 'block text-sm tracking-wide font-[GeistRegular]',
} as const

type TextVariant = keyof typeof typographyVariants

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  h5: 'heading',
  h6: 'heading',
  p: Platform.select({ web: 'text' as Role }),
  small: Platform.select({ web: 'note' as Role }),
  ol: Platform.select({ web: 'list' as Role }),
  ul: Platform.select({ web: 'list' as Role }),
  blockquote: Platform.select({ web: 'blockquote' as Role }),
  code: Platform.select({ web: 'code' as Role }),
  caption: Platform.select({ web: 'text' as Role }),
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
  variant = 'p',
  ...props
}: React.ComponentProps<typeof RNText> & {
  variant?: TextVariant
} & React.RefAttributes<RNText>) {
  const textClass = React.useContext(TextClassContext)
  return (
    <RNText
      className={cn(
        'text-base text-foreground',
        typographyVariants[variant],
        textClass,
        className,
      )}
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      {...props}
    />
  )
}

export { Text, TextClassContext }
