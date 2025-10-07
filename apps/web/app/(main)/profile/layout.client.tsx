'use client'

import { usePathname } from 'next/navigation'

import { Tabs as ShadcnTabs } from '@yukinu/ui/tabs'

export const Tabs: React.FC<React.ComponentProps<typeof ShadcnTabs>> = ({
  ...props
}) => {
  const pathname = usePathname()
  const rawValue = pathname.split('/')[2] ?? 'account'
  const value = rawValue === 'edit' ? 'account' : rawValue

  return <ShadcnTabs defaultValue={value} {...props} />
}
