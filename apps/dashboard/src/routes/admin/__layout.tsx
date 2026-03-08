import { useSession } from '@yukinu/auth/react'
import { Navigate, Outlet } from 'react-router'

export default function AdminLayout() {
  const { status, user } = useSession()

  if (status === 'loading') return null
  if (!['admin', 'moderator'].includes(user?.role ?? ''))
    return <Navigate to='/' />

  return <Outlet />
}
