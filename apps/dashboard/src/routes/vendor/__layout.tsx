import { useSession } from '@yukinu/auth/react'
import { Navigate, Outlet } from 'react-router'

export default function VendorLayout() {
  const { status, user } = useSession()

  if (status === 'loading') return null
  if (!['vendor_owner', 'vendor_staff'].includes(user?.role ?? ''))
    return <Navigate to='/' />

  return <Outlet />
}
