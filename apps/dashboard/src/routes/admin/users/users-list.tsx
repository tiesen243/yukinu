import { useQuery } from '@tanstack/react-query'
import { Badge } from '@yukinu/ui/badge'
import { TableCell, TableRow } from '@yukinu/ui/table'
import { Activity } from 'react'

import { useTRPC } from '@/lib/trpc/react'
import { DeleteUserButton } from '@/routes/admin/users/_components/delete-user-button'
import { EditUserButton } from '@/routes/admin/users/_components/edit-user-button'
import { PermamentlyDeleteUserButton } from '@/routes/admin/users/_components/permamently-delete-user-button'
import { RestoreUserButton } from '@/routes/admin/users/_components/restore-user-button'
import { useUserQueryStates } from '@/routes/admin/users/hook'

export const UsersList: React.FC = () => {
  const trpc = useTRPC()
  const [query] = useUserQueryStates()

  const { data, isLoading } = useQuery(trpc.user.all.queryOptions(query))

  if (isLoading)
    return Array.from({ length: 5 }, (_, index) => (
      <TableRow key={index}>
        {Array.from({ length: 9 }, (_, cellIndex) => (
          <TableCell key={cellIndex}>
            <div className='animate-pulse rounded bg-muted/50'>&nbsp;</div>
          </TableCell>
        ))}
      </TableRow>
    ))

  return data?.users.map((user) => (
    <TableRow key={user.id}>
      <TableCell>{user.id}</TableCell>
      <TableCell>{user.username}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.role.split('_').join(' ')}</TableCell>
      <TableCell>
        <Badge variant={user.status === 'active' ? 'success' : 'destructive'}>
          {user.status}
        </Badge>
      </TableCell>
      <TableCell>{user.emailVerified?.toLocaleDateString()}</TableCell>
      <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
      <TableCell>{user.updatedAt.toLocaleDateString()}</TableCell>
      <TableCell>{user.deletedAt?.toLocaleDateString() ?? 'N/A'}</TableCell>
      <TableCell className='space-x-2'>
        <Activity mode={user.deletedAt ? 'visible' : 'hidden'}>
          <RestoreUserButton user={user} />
          <PermamentlyDeleteUserButton user={user} />
        </Activity>

        <Activity mode={user.deletedAt ? 'hidden' : 'visible'}>
          <EditUserButton user={user} />
          <DeleteUserButton user={user} />
        </Activity>
      </TableCell>
    </TableRow>
  ))
}
