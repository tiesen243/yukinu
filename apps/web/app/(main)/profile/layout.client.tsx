'use client'

import { usePathname } from 'next/navigation'

import { Tabs as ShadcnTabs } from '@yukinu/ui/tabs'

export const Tabs: React.FC<React.ComponentProps<typeof ShadcnTabs>> = ({
  ...props
}) => {
  const pathname = usePathname()
  const value = pathname.split('/')[2] ?? 'account'

  return <ShadcnTabs defaultValue={value} {...props} />
}
