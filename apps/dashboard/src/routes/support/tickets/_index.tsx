import { useQuery } from '@tanstack/react-query'
import { useSession } from '@yukinu/auth/react'
import { Badge } from '@yukinu/ui/badge'
import { buttonVariants } from '@yukinu/ui/button'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@yukinu/ui/item'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@yukinu/ui/tabs'
import { Typography } from '@yukinu/ui/typography'
import { ticketStatuses, type TicketStatus } from '@yukinu/validators/general'
import { Link } from 'react-router'

import { useTRPC } from '@/lib/trpc/react'

export default function SupportTicketsPage() {
  return (
    <>
      <Typography variant='h2'>Support Tickets</Typography>

      <div className='flex justify-between'>
        <Typography className='text-muted-foreground'>
          View and manage all support tickets submitted by users.
        </Typography>

        <Link to='/support/tickets/new' className={buttonVariants()}>
          Create New Ticket
        </Link>
      </div>

      <Tabs defaultValue='open' className='mt-4'>
        <TabsList>
          {ticketStatuses.map((status) => (
            <TabsTrigger key={status} value={status}>
              {status}
            </TabsTrigger>
          ))}
        </TabsList>

        {ticketStatuses.map((status) => (
          <TabsContent key={status} value={status}>
            <ItemGroup>
              <Tickets status={status} />
            </ItemGroup>
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}

const Tickets: React.FC<{ status: TicketStatus }> = ({ status }) => {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(trpc.ticket.all.queryOptions({ status }))
  const { session, status: sessionStatus } = useSession()

  if (isLoading || sessionStatus !== 'authenticated')
    return Array.from({ length: 3 }, (_, i) => (
      <Item key={i} variant='outline' className='animate-pulse'>
        <ItemContent>
          <ItemTitle className='bg-muted w-1/3 rounded-sm'>&nbsp;</ItemTitle>
          <ItemDescription className='bg-muted w-1/2 rounded-sm'>
            &nbsp;
          </ItemDescription>
        </ItemContent>

        <ItemContent>
          <Badge className='w-10 bg-muted'>&nbsp;</Badge>
        </ItemContent>
      </Item>
    ))

  return data?.tickets.map((ticket) => (
    <Item
      key={ticket.id}
      variant='outline'
      render={
        ['admin', 'moderator'].includes(session.user.role) ? (
          <Link to={`/support/tickets/${ticket.id}`} />
        ) : (
          <div />
        )
      }
    >
      <ItemContent>
        <ItemTitle>{ticket.subject}</ItemTitle>
        <ItemDescription>{ticket.description}</ItemDescription>
      </ItemContent>

      <ItemContent>
        <Badge
          variant={
            ticket.status === 'open'
              ? 'info'
              : ticket.status === 'closed'
                ? 'destructive'
                : 'success'
          }
        >
          {ticket.status}
        </Badge>
      </ItemContent>
    </Item>
  ))
}
