import { Typography } from '@yukinu/ui/typography'

import { CustomerTrend } from '@/routes/(others)/analytics/_components/customer-trend'
import { OrderStatusChart } from '@/routes/(others)/analytics/_components/order-status-chart'
import { TopVendors } from '@/routes/(others)/analytics/_components/top-vendors'

export default function AnalyticsIndexPage() {
  return (
    <>
      <Typography variant='h2'>Platform Analytics</Typography>
      <Typography className='text-muted-foreground'>
        Explore comprehensive insights into marketplace performance, user
        behavior, and vendor trends to drive informed decisions and optimize
        growth strategies.
      </Typography>

      <section className='my-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <h3 className='sr-only'>Key Metrics</h3>

        <OrderStatusChart />
        <CustomerTrend />
      </section>

      <TopVendors />
    </>
  )
}
