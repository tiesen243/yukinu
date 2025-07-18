'use client'

import type * as DialogPrimitive from '@radix-ui/react-dialog'
import * as React from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@yuki/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from '@yuki/ui/drawer'
import { useMediaQuery } from '@yuki/ui/hooks/use-media-query'

const ResponsiveDialogContext = React.createContext<{
  isMobile: boolean
} | null>(null)

const useResponsiveDialog = () => {
  const context = React.use(ResponsiveDialogContext)
  if (!context)
    throw new Error(
      'useResponsiveDialog must be used within a ResponsiveDialogProvider',
    )
  return context
}

function ResponsiveDialog(props: DialogPrimitive.DialogProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')

  const value = React.useMemo(() => ({ isMobile }), [isMobile])

  const Comp = isMobile ? Drawer : Dialog

  return (
    <ResponsiveDialogContext value={value}>
      <Comp {...props} />
    </ResponsiveDialogContext>
  )
}

function ResponsiveDialogTrigger(props: DialogPrimitive.DialogTriggerProps) {
  const { isMobile } = useResponsiveDialog()
  return isMobile ? <DrawerTrigger {...props} /> : <DialogTrigger {...props} />
}

function ResponsiveDialogPortal(props: DialogPrimitive.DialogPortalProps) {
  const { isMobile } = useResponsiveDialog()
  return isMobile ? <DrawerPortal {...props} /> : <DialogPortal {...props} />
}

function ResponsiveDialogClose(props: DialogPrimitive.DialogCloseProps) {
  const { isMobile } = useResponsiveDialog()
  return isMobile ? <DrawerClose {...props} /> : <DialogClose {...props} />
}

function ResponsiveDialogOverlay(props: DialogPrimitive.DialogOverlayProps) {
  const { isMobile } = useResponsiveDialog()
  return isMobile ? <DrawerOverlay {...props} /> : <DialogOverlay {...props} />
}

function ResponsiveDialogContent(props: DialogPrimitive.DialogContentProps) {
  const { isMobile } = useResponsiveDialog()
  return isMobile ? <DrawerContent {...props} /> : <DialogContent {...props} />
}

function ResponsiveDialogHeader(
  props: React.ComponentProps<typeof DialogHeader>,
) {
  const { isMobile } = useResponsiveDialog()
  return isMobile ? <DrawerHeader {...props} /> : <DialogHeader {...props} />
}

function ResponsiveDialogFooter(
  props: React.ComponentProps<typeof DialogFooter>,
) {
  const { isMobile } = useResponsiveDialog()
  return isMobile ? <DrawerFooter {...props} /> : <DialogFooter {...props} />
}

function ResponsiveDialogTitle(props: DialogPrimitive.DialogTitleProps) {
  const { isMobile } = useResponsiveDialog()
  return isMobile ? <DrawerTitle {...props} /> : <DialogTitle {...props} />
}

function ResponsiveDialogDescription(
  props: DialogPrimitive.DialogDescriptionProps,
) {
  const { isMobile } = useResponsiveDialog()
  return isMobile ? (
    <DrawerDescription {...props} />
  ) : (
    <DialogDescription {...props} />
  )
}

export {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogPortal,
  ResponsiveDialogClose,
  ResponsiveDialogOverlay,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
}
