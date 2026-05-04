import { useQuery } from '@tanstack/react-query'
import { UserEntity } from '@yukinu/api/identity'
import { Badge } from '@yukinu/ui/badge'
import { Button } from '@yukinu/ui/button'
import { Typography } from '@yukinu/ui/typography'
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs'

import { DataTable } from '@/components/data-table'
import { useTRPC } from '@/lib/trpc'
import { UserSearchForm } from '@/routes/(management)/users/components/search-form'
import { UpdateUserButton } from '@/routes/(management)/users/components/update-user-button'
import { UserButton } from '@/routes/(management)/users/components/user-button'

const STATUS_VARIANTS = {
  active: 'success',
  inactive: 'warning',
  banned: 'destructive',
} as const

export default function ManagementUsersIndexPage() {
  const { trpc } = useTRPC()
  const [query, setQuery] = useQueryStates(
    {
      search: parseAsString.withDefault(''),
      role: parseAsStringEnum([...UserEntity.roles]),
      isDeleted: parseAsBoolean.withDefault(false),
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
    },
    { urlKeys: { isDeleted: 'is_deleted' } },
  )

  const { data, isLoading } = useQuery(
    trpc.identity.user.all.queryOptions({
      ...query,
      role: query.role?.trim() ? query.role : undefined,
    }),
  )

  return (
    <>
      <Typography variant='h2'>Users</Typography>
      <Typography className='text-muted-foreground'>
        Manage and view all system users. Edit user information, monitor account
        status, and configure roles and permissions.
      </Typography>

      <DataTable
        header={
          <div className='flex items-center gap-2'>
            <UserSearchForm
              query={query}
              onSearch={({ search, role }) =>
                setQuery({ search, role, page: 1 })
              }
            />
            <Button
              variant='outline'
              onClick={() => setQuery({ isDeleted: !query.isDeleted, page: 1 })}
            >
              {query.isDeleted ? 'Show Active Users' : 'Show Deleted Users'}
            </Button>
          </div>
        }
        data={data?.users ?? []}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        columns={{
          id: 'ID',
          username: 'Username',
          role: {
            label: 'Role',
            render: (value) => value.split('_').join(' '),
          },
          status: {
            label: 'Status',
            render: (value) => (
              <Badge variant={STATUS_VARIANTS[value]}>
                {value?.toString()}
              </Badge>
            ),
          },
          email: 'Email',
          emailVerified: 'Email Verified',
          createdAt: 'Created At',
          updatedAt: 'Updated At',
          deletedAt: 'Deleted At',
        }}
        actions={(item) => (
          <div className='flex items-center gap-2'>
            {item.deletedAt === null ? (
              <UpdateUserButton
                userId={item.id}
                username={item.username}
                userRole={item.role}
                userStatus={item.status}
              />
            ) : (
              <UserButton
                userId={item.id}
                username={item.username}
                type='restore'
                variant='default'
              />
            )}

            <UserButton
              userId={item.id}
              username={item.username}
              type={item.deletedAt === null ? 'delete' : 'permanentDelete'}
              variant='destructive'
            />
          </div>
        )}
        pagination={{
          ...data?.pagination,
          setPage: (page) => setQuery({ page }),
        }}
      />
    </>
  )
}
