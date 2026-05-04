import { useQuery } from '@tanstack/react-query'
import { TicketEntity } from '@yukinu/api/identity'
import { useSession } from '@yukinu/auth/react'
import { Badge } from '@yukinu/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@yukinu/ui/tabs'
import { Typography } from '@yukinu/ui/typography'
import { parseAsInteger, parseAsStringEnum, useQueryStates } from 'nuqs'
import { useMemo } from 'react'

import { DataTable } from '@/components/data-table'
import { useTRPC } from '@/lib/trpc'
import { CreateTicketButton } from '@/routes/support-tickets/_components/create-ticket-buttont'
import { UpdateTicketStatus } from '@/routes/support-tickets/_components/update-ticket-status'

export default function TicketsIndexPage() {
  const { trpc } = useTRPC()
  const { user } = useSession()

  const [query, setQuery] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    status: parseAsStringEnum([...TicketEntity.statuses]),
  })

  const isAdmin = useMemo(
    () => ['admin', 'moderator'].includes(user?.role ?? ''),
    [user?.role],
  )

  const { data, isLoading } = useQuery(
    isAdmin
      ? trpc.identity.ticket.all.queryOptions(query)
      : trpc.identity.ticket.me.queryOptions(query),
  )

  return (
    <>
      <Typography variant='h2'>Tickets</Typography>
      <Typography className='text-muted-foreground'>
        View and manage your support tickets. Keep track of customer inquiries,
        respond to issues promptly, and ensure a high level of customer
        satisfaction by providing timely and effective support.
      </Typography>

      <DataTable
        header={
          <div className='flex items-center justify-between'>
            <Tabs>
              <TabsList variant='line'>
                <TabsTrigger
                  value='all'
                  onClick={() => setQuery({ status: null })}
                >
                  All
                </TabsTrigger>
                {TicketEntity.statuses.map((status) => (
                  <TabsTrigger
                    key={status}
                    value={status}
                    onClick={() => setQuery({ status })}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {!isAdmin && <CreateTicketButton />}
          </div>
        }
        data={data?.tickets ?? []}
        keyExtractor={(ticket) => ticket.id}
        isLoading={isLoading}
        columns={{
          id: 'ID',
          subject: 'Subject',
          status: {
            label: 'Status',
            render: (status) => (
              <Badge variant={STATUS_VARIANTS[status]}>{status}</Badge>
            ),
          },
          createdAt: 'Created At',
        }}
        pagination={{
          ...data?.pagination,
          setPage: (page) => setQuery({ page }),
        }}
        actions={(item) =>
          isAdmin && (
            <UpdateTicketStatus
              ticketId={item.id}
              currentStatus={item.status}
            />
          )
        }
      />
    </>
  )
}

const STATUS_VARIANTS = {
  open: 'info',
  resolved: 'success',
  closed: 'destructive',
} as const
