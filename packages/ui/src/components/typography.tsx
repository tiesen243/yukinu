import type { VariantProps } from 'class-variance-authority'
import { mergeProps } from '@base-ui/react'
import { useRender } from '@base-ui/react/use-render'
import { cva } from 'class-variance-authority'

import { cn } from '@/utils'

const typographyVariants = cva('text-foreground', {
  variants: {
    variant: {
      h1: 'my-8 scroll-m-20 text-4xl font-extrabold tracking-tight text-balance lg:text-5xl',
      h2: 'my-5 scroll-m-20 text-3xl font-bold tracking-tight text-balance first:mt-0 lg:text-4xl',
      h3: 'my-4 scroll-m-20 text-2xl font-semibold tracking-tight text-balance lg:text-3xl',
      h4: 'my-3 scroll-m-20 text-xl font-semibold tracking-tight text-balance lg:text-2xl',
      h5: 'my-2.5 scroll-m-20 text-lg font-semibold tracking-tight text-balance lg:text-xl',
      h6: 'my-2 scroll-m-20 text-base font-semibold tracking-tight text-balance lg:text-lg',
      p: 'text-base leading-relaxed text-pretty lg:text-lg',
      ul: 'my-4 ml-6 list-disc text-base lg:text-lg [&>li]:mt-2 [&>li]:first:mt-0',
      ol: 'my-4 ml-6 list-decimal text-base lg:text-lg [&>li]:mt-2 [&>li]:first:mt-0',
      blockquote: 'my-2 border-l-2 pl-6 italic',
      code: 'relative w-fit rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium',
      caption: 'block text-sm tracking-wide',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
})

interface TypographyProps
  extends
    useRender.ComponentProps<'p'>,
    VariantProps<typeof typographyVariants> {}

function Typography({
  className,
  variant = 'p',
  render,
  ...props
}: TypographyProps) {
  return useRender({
    defaultTagName: variant ?? 'p',
    props: mergeProps<'p'>(
      { className: cn(typographyVariants({ variant, className })) },
      props,
    ),
    render,
    state: {
      slot: 'typography',
      variant,
    },
  })
}

export { Typography, typographyVariants }
