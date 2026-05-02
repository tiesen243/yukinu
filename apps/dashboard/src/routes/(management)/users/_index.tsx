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
          <UserSearchForm
            query={query}
            onSearch={({ search, role, isDeleted }) =>
              setQuery({ search, role, isDeleted, page: 1 })
            }
          />
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
        actions={() => (
          <div className='flex items-center gap-2'>
            <Button>Edit</Button>
            <Button variant='destructive'>Delete</Button>
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
