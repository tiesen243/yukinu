import { Navigate, Outlet } from 'react-router'

import { useSession } from '@yukinu/auth/react'

export default function AdminLayout() {
  const { session, status } = useSession()

  if (status === 'loading') return null
  if (!['admin', 'moderator'].includes(session?.user.role ?? ''))
    return <Navigate to='/' />

  return <Outlet />
}
