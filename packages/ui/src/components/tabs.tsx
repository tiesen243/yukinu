'use client'

import type { VariantProps } from 'class-variance-authority'
import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva } from 'class-variance-authority'

import { cn } from '@yuki/ui'

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot='tabs'
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  )
}

const tabsListVariant = cva(
  'group/tabs inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        underline: 'bg-background',
        border: 'border bg-background',
        light: 'bg-background',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface TabsListProps
  extends React.ComponentProps<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariant> {}

function TabsList({ className, variant, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot='tabs-list'
      data-variant={variant ?? 'default'}
      className={cn(tabsListVariant({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot='tabs-trigger'
      className={cn(
        'group-data-[variant=default]/tabs:rounded-md group-data-[variant=default]/tabs:border group-data-[variant=default]/tabs:data-[state=active]:bg-background group-data-[variant=default]/tabs:data-[state=active]:shadow-sm group-data-[variant=default]/tabs:dark:data-[state=active]:border-input group-data-[variant=default]/tabs:dark:data-[state=active]:bg-input/30',
        'group-data-[variant=underline]/tabs:border-b group-data-[variant=underline]/tabs:data-[state=active]:border-primary',
        'group-data-[variant=border]/tabs:rounded-md group-data-[variant=border]/tabs:border group-data-[variant=border]/tabs:data-[state=active]:border group-data-[variant=border]/tabs:data-[state=active]:border-border',
        'group-data-[variant=light]/tabs:rounded-md group-data-[variant=light]/tabs:border group-data-[variant=light]/tabs:data-[state=active]:bg-background group-data-[variant=light]/tabs:data-[state=active]:shadow-sm group-data-[variant=light]/tabs:dark:data-[state=active]:border-input group-data-[variant=light]/tabs:dark:data-[state=active]:bg-input/30',
        "inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 dark:text-muted-foreground dark:data-[state=active]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot='tabs-content'
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
