import { ThemeProvider } from '@yukinu/ui'
import { ToastProvider } from '@yukinu/ui/toast'
import { TooltipProvider } from '@yukinu/ui/tooltip'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'

import { TRPCProvider } from '@/lib/trpc'

export const Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ThemeProvider
    attribute='class'
    defaultTheme='system'
    disableTransitionOnChange
  >
    <NuqsAdapter>
      <TooltipProvider>
        <ToastProvider>
          <TRPCProvider>{children}</TRPCProvider>
        </ToastProvider>
      </TooltipProvider>
    </NuqsAdapter>
  </ThemeProvider>
)
