import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import { cn } from '@/utils'

const typographyVariants = cva('text-base font-normal', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight text-balance',
      h2: 'my-4 scroll-m-20 text-2xl font-bold tracking-tight text-balance',
      h3: 'my-2 scroll-m-20 text-xl font-semibold tracking-tight text-balance',
      h4: 'my-2 scroll-m-20 text-lg font-semibold tracking-tight text-balance',
      p: 'text-justify leading-7 text-pretty',
      small: 'block text-sm leading-none font-medium tracking-wide',
      ul: 'my-4 ml-6 list-disc text-base [&>li]:mt-2 [&>li]:first:mt-0',
      ol: 'my-4 ml-6 list-decimal text-base [&>li]:mt-2 [&>li]:first:mt-0',
      blockquote:
        'my-4 inline-block border-l-2 pl-6 italic before:content-["“"] after:content-["”"]',
      code: 'relative w-fit rounded-sm border border-accent bg-accent/40 px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium text-accent-foreground',
      caption:
        'mt-1 block text-center text-sm tracking-wide text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
})

interface TypographyProps
  extends React.ComponentProps<'p'>, VariantProps<typeof typographyVariants> {
  as?: React.ElementType
}

function Typography({
  className,
  variant = 'p',
  as,
  ...props
}: TypographyProps) {
  const Comp = as ?? variant ?? 'p'

  return (
    <Comp
      data-slot='typography'
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Typography, typographyVariants }
