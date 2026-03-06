import type { VariantProps } from '@yukinu/ui'
import type { Role } from 'react-native'

import { cn } from '@yukinu/ui'
import { typographyVariants } from '@yukinu/ui/typography'
import * as React from 'react'
import { Text as RNText } from 'react-native'

type TextVariantProps = VariantProps<typeof typographyVariants>
type TextVariant = NonNullable<TextVariantProps['variant']>

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  h5: 'heading',
  h6: 'heading',
  blockquote: 'blockquote' as Role,
  ul: 'list',
  ol: 'list',
  code: 'code' as Role,
}

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: '1',
  h2: '2',
  h3: '3',
  h4: '4',
  h5: '5',
  h6: '6',
}

const TextContext = React.createContext<string | null>(null)

function TextProvider({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className: string }>) {
  return <TextContext value={className}>{children}</TextContext>
}

interface TextProps
  extends React.ComponentProps<typeof RNText>, TextVariantProps {}

function Text({ className = '', variant = 'p', ...props }: TextProps) {
  const context = React.use(TextContext)

  return (
    <RNText
      data-slot='text'
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      className={cn(typographyVariants({ variant }), className, context)}
      {...props}
    />
  )
}

export { TextProvider, Text }
