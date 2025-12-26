import { useSession } from '@yukinu/auth/react'
import { Navigate, Outlet } from 'react-router'

export default function AdminLayout() {
  const { session, status } = useSession()

  if (status === 'loading') return null
  if (!['admin', 'moderator'].includes(session?.user.role ?? ''))
    return <Navigate to='/' />

  return <Outlet />
}
