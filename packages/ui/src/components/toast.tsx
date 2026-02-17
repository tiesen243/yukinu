'use client'

import { Toast as ToastPrimitive } from '@base-ui/react'
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react'

import { buttonVariants } from '@/components/button'
import { cn } from '@/utils'

const toast = ToastPrimitive.createToastManager()

type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

const icons = {
  success: CircleCheckIcon,
  info: InfoIcon,
  warning: TriangleAlertIcon,
  error: OctagonXIcon,
  loading: Loader2Icon,
} as const

interface ToastProviderProps extends ToastPrimitive.Provider.Props {
  position?: ToastPosition
}

function ToastProvider({
  position = 'bottom-right',
  children,
  ...props
}: ToastProviderProps) {
  return (
    <ToastPrimitive.Provider toastManager={toast} {...props}>
      {children}

      <ToastPrimitive.Portal data-slot='toaster-portal'>
        <ToastPrimitive.Viewport
          data-slot='toaster-viewport'
          data-position={position}
          className={cn(
            'fixed z-50 mx-auto flex w-[calc(100%-var(--toast-inset)*2)] max-w-90 [--toast-inset:--spacing(4)] sm:[--toast-inset:--spacing(8)]',
            // Vertical positions
            'data-[position*=top]:top-(--toast-inset)',
            'data-[position*=bottom]:bottom-(--toast-inset)',
            // Horizontal positions
            'data-[position*=left]:left-(--toast-inset)',
            'data-[position*=center]:left-1/2 data-[position*=center]:-translate-x-1/2',
            'data-[position*=right]:right-(--toast-inset)',
          )}
        >
          <Toaster position={position} />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  )
}

function Toaster({
  position = 'bottom-right',
}: Pick<ToastProviderProps, 'position'>) {
  const { toasts } = ToastPrimitive.useToastManager()

  let swipeDirection: ToastPrimitive.Root.Props['swipeDirection'] = []
  if (position.includes('top')) swipeDirection.push('up')
  if (position.includes('bottom')) swipeDirection.push('down')
  if (position.includes('left')) swipeDirection.push('left')
  if (position.includes('right')) swipeDirection.push('right')
  if (position.includes('center')) swipeDirection.push('right', 'left')

  return toasts.map((toast) => {
    const Icon = toast.type ? icons[toast.type as keyof typeof icons] : null

    return (
      <ToastPrimitive.Root
        key={toast.id}
        data-slot='toast-root'
        data-position={position}
        data-type={toast.type}
        toast={toast}
        className={cn(
          'group/toast absolute z-[calc(1000-var(--toast-index))] h-(--toast-calc-height) w-full rounded-lg bg-clip-padding shadow-lg/5 select-none [transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s]',
          // Variables for calculating position and animation
          '[--gap:0.5rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]',
          'data-[position*=top]:[--toast-calc-offset-y:calc(var(--toast-offset-y)+var(--toast-index)*var(--toast-gap)+var(--toast-swipe-movement-y))]',
          'data-[position*=bottom]:[--toast-calc-offset-y:calc(var(--toast-offset-y)*-1+var(--toast-index)*var(--toast-gap)*-1+var(--toast-swipe-movement-y))]',
          // Variants
          'border bg-popover text-popover-foreground',
          'data-[type=success]:border-green-600 data-[type=success]:bg-green-100 data-[type=success]:text-green-600 dark:data-[type=success]:border-green-400 dark:data-[type=success]:bg-green-950 dark:data-[type=success]:text-green-400',
          'data-[type=error]:border-red-600 data-[type=error]:bg-red-100 data-[type=error]:text-red-600 dark:data-[type=error]:border-red-400 dark:data-[type=error]:bg-red-950 dark:data-[type=error]:text-red-400',
          'data-[type=info]:border-blue-600 data-[type=info]:bg-blue-100 data-[type=info]:text-blue-600 dark:data-[type=info]:border-blue-400 dark:data-[type=info]:bg-blue-950 dark:data-[type=info]:text-blue-400',
          'data-[type=warning]:border-yellow-600 data-[type=warning]:bg-yellow-100 data-[type=warning]:text-yellow-600 dark:data-[type=warning]:border-yellow-400 dark:data-[type=warning]:bg-yellow-950 dark:data-[type=warning]:text-yellow-400',
          // Base positioning using data-position
          'data-[position*=right]:right-0 data-[position*=right]:left-auto data-[position*=right]:mr-0',
          'data-[position*=left]:right-auto data-[position*=left]:left-0 data-[position*=left]:ml-0',
          'data-[position*=center]:right-0 data-[position*=center]:left-0',
          'data-[position*=top]:top-0 data-[position*=top]:bottom-auto data-[position*=top]:origin-top',
          'data-[position*=bottom]:top-auto data-[position*=bottom]:bottom-0 data-[position*=bottom]:origin-bottom',
          // Swipe animations
          'data-[position*=bottom]:data-[starting-style]:[transform:translateY(150%)] data-[position*=top]:data-[starting-style]:[transform:translateY(-150%)]',
          'transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]',
          'data-[position*=top]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--peek))+(var(--shrink)*var(--height))))_scale(var(--scale))]',
          // After swipe animations
          'after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-[""]',
          // Ending styles
          'data-[ending-style]:opacity-0 data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]',
          'data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]',
          '[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]',
          // Expanded styles
          'data-[expanded]:h-[var(--toast-height)] data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)))] data-[limited]:opacity-0 data-[position*=top]:data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)*-1))]',
          'data-[expanded]:data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-[expanded]:data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-[expanded]:data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-[expanded]:data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]',
        )}
        swipeDirection={swipeDirection}
      >
        <ToastPrimitive.Content
          data-slot='toast-content'
          className='relative flex items-center justify-between gap-0.5 px-4 py-3 transition-opacity data-behind:pointer-events-none data-behind:opacity-0 data-expanded:opacity-100'
        >
          <div
            data-slot='toast-message'
            className='@container/toast-content grid flex-1 auto-rows-min items-start gap-1 not-has-data-[slot=toast-title]:flex not-has-data-[slot=toast-title]:items-center has-data-[slot=toast-action]:grid-cols-[1fr_auto] has-data-[slot=toast-description]:grid-rows-[auto_auto]'
          >
            <div
              data-slot='toast-header'
              className='flex flex-row items-center gap-2'
            >
              {Icon && (
                <Icon
                  data-slot='toast-icon'
                  className='size-4 shrink-0 in-data-[type=loading]:animate-spin in-data-[type=loading]:text-muted-foreground'
                />
              )}

              <ToastPrimitive.Title
                data-slot='toast-title'
                className='text-sm font-medium'
              />
            </div>

            <ToastPrimitive.Description
              data-slot='toast-description'
              className='text-sm not-in-data-type:text-muted-foreground in-data-[type=loading]:text-muted-foreground'
            />
          </div>

          {toast.actionProps && (
            <ToastPrimitive.Action
              data-slot='toast-action'
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'xs' }),
                'hover:bg-current/20 hover:text-current dark:hover:bg-current/20',
              )}
              {...toast.actionProps}
            />
          )}
        </ToastPrimitive.Content>
      </ToastPrimitive.Root>
    )
  })
}

export { toast, ToastProvider }
