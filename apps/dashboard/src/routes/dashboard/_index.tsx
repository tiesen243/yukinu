import { useSession } from '@yukinu/auth/react'
import { Typography } from '@yukinu/ui/typography'

import { RecentTransactions } from '@/routes/dashboard/_components/recent-transactions'
import { RevenueChart } from '@/routes/dashboard/_components/revenue-chart'
import { Stats } from '@/routes/dashboard/_components/stats'
import { TopProductsChart } from '@/routes/dashboard/_components/top-products-chart'

export default function DashboardIndexPage() {
  const { status, user } = useSession()

  if (status !== 'authenticated') return null
  return (
    <DashboardIndexPageContent
      isAdmin={['admin', 'moderator'].includes(user.role)}
    />
  )
}

const DashboardIndexPageContent: React.FC<{ isAdmin: boolean }> = ({
  isAdmin,
}) => (
  <>
    <Typography variant='h2'>Admin Insights</Typography>
    <Typography className='text-muted-foreground'>
      Get a comprehensive overview of your marketplace's performance, including
      key metrics, revenue trends, top-selling products, and recent
      transactions, all in one place to help you make informed decisions and
      optimize your business strategy.
    </Typography>

    <Stats isAdmin={isAdmin} />

    <section className='my-4 grid gap-4 lg:grid-cols-7'>
      <h3 className='sr-only'>Performance Charts</h3>

      <RevenueChart isAdmin={isAdmin} />
      <TopProductsChart isAdmin={isAdmin} />
    </section>

    <RecentTransactions isAdmin={isAdmin} />
  </>
)
