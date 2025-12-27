'use client'

import type { ToasterProps } from 'sonner'

import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Toaster as Sonner, toast } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      icons={{
        success: <CircleCheckIcon className='size-4' />,
        info: <InfoIcon className='size-4' />,
        warning: <TriangleAlertIcon className='size-4' />,
        error: <OctagonXIcon className='size-4' />,
        loading: <Loader2Icon className='size-4 animate-spin' />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',

          '--success-bg':
            'color-mix(in oklab, var(--success) 20%, var(--background))',
          '--success-border':
            'color-mix(in oklab, var(--success) 40%, var(--background))',
          '--success-text': 'var(--success)',

          '--error-bg':
            'color-mix(in oklab, var(--destructive) 20%, var(--background))',
          '--error-border':
            'color-mix(in oklab, var(--destructive) 40%, var(--background))',
          '--error-text': 'var(--destructive)',

          '--info-bg':
            'color-mix(in oklab, var(--info) 20%, var(--background))',
          '--info-border':
            'color-mix(in oklab, var(--info) 40%, var(--background))',
          '--info-text': 'var(--info)',

          '--warning-bg':
            'color-mix(in oklab, var(--warning) 20%, var(--background))',
          '--warning-border':
            'color-mix(in oklab, var(--warning) 40%, var(--background))',
          '--warning-text': 'var(--warning)',

          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
