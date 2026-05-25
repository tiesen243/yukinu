import { useQuery } from '@tanstack/react-query'
import { formatPrice } from '@yukinu/lib/utils'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@yukinu/ui/alert-dialog'
import { Button } from '@yukinu/ui/button'
import { Typography } from '@yukinu/ui/typography'

import { DataTable } from '@/components/data-table'
import { useTRPC } from '@/lib/trpc'

export default function MerchantBalanceIndexPage() {
  const { trpc } = useTRPC()

  const { data, isLoading } = useQuery(
    trpc.merchant.vendor.balance.queryOptions({}),
  )

  return (
    <>
      <Typography variant='h2'>Balance</Typography>
      <Typography className='text-muted-foreground'>
        View and manage your current balance, transaction history, and payout
        details. Keep track of your earnings and ensure timely payouts to
        maintain a healthy cash flow for your business.
      </Typography>

      <DataTable
        header={
          <div className='flex items-center justify-between gap-2'>
            <Typography variant='h3' className='m-0'>
              Current Balance:{' '}
              {data?.balance ? formatPrice(data.balance.balance) : 'Loading...'}
            </Typography>

            <AlertDialog>
              <AlertDialogTrigger
                render={<Button variant='outline'>Cash Out</Button>}
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Keep Dreaming, Pal!</AlertDialogTitle>
                  <AlertDialogDescription className='space-y-3'>
                    <p>
                      What made you think you could actually withdraw that
                      money?
                    </p>
                    <p className='rounded-md border-l-4 border-destructive bg-muted p-3 font-mono text-muted-foreground italic'>
                      "Once the money touches my database, it's legally,
                      spiritually, and physically MY money." — The Dev.
                    </p>
                    <p>
                      There is no Cash Out button. There is no finance team. If
                      you really want that balance, you'll have to track down my
                      IP, break into my house, and fight me in a 1v1 mid lane.
                      Good luck with that!
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    I accept my fate, I'm broke.
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
        data={data?.transfers ?? []}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        columns={{
          id: 'ID',
          amountIn: {
            label: 'Amount In',
            render: (val) => (val ? formatPrice(val) : '-'),
          },
          amountOut: {
            label: 'Amount Out',
            render: (val) => (val ? formatPrice(val) : '-'),
          },
          reference: 'Reference',
          createdAt: 'Created At',
        }}
      />
    </>
  )
}
