import { Typography } from '@yukinu/ui/typography'

import { userContext } from '@/lib/context'
import { RecentTransactions } from '@/routes/dashboard/_components/recent-transactions'
import { RevenueChart } from '@/routes/dashboard/_components/revenue-chart'
import { Stats } from '@/routes/dashboard/_components/stats'
import { TopProductsChart } from '@/routes/dashboard/_components/top-products-chart'

import type { Route } from './+types/_index'

export const loader = ({ context }: Route.LoaderArgs) => {
  const user = context.get(userContext)
  return { isAdmin: ['admin', 'moderator'].includes(user?.role ?? '') }
}

export default function DashboardIndexPage({
  loaderData,
}: Route.ComponentProps) {
  return (
    <>
      <Typography variant='h2'>Admin Insights</Typography>
      <Typography className='text-muted-foreground'>
        Get a comprehensive overview of your marketplace's performance,
        including key metrics, revenue trends, top-selling products, and recent
        transactions, all in one place to help you make informed decisions and
        optimize your business strategy.
      </Typography>

      <Stats isAdmin={loaderData.isAdmin} />

      <section className='my-4 grid gap-4 lg:grid-cols-7'>
        <h3 className='sr-only'>Performance Charts</h3>

        <RevenueChart isAdmin={loaderData.isAdmin} />
        <TopProductsChart isAdmin={loaderData.isAdmin} />
      </section>

      <RecentTransactions isAdmin={loaderData.isAdmin} />
    </>
  )
}
