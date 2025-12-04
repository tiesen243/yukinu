import { Navigate, Outlet } from 'react-router'

import { useSession } from '@yukinu/auth/react'

export default function VendorLayout() {
  const { session, status } = useSession()

  if (status === 'loading') return null
  if (!['vendor_owner', 'vendor_staff'].includes(session?.user.role ?? ''))
    return <Navigate to='/' />

  return <Outlet />
}
