import type { ChartConfig } from '@yukinu/ui/chart'

import {
  DollarSignIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  UsersIcon,
} from '@yukinu/ui/icons'
import { Typography } from '@yukinu/ui/typography'

import { CategoryDistributionChart } from '@/routes/(dashboard)/_components/category-distribution'
import { OrdersAndCustomers } from '@/routes/(dashboard)/_components/orders-customers'
import { ProductPerformance } from '@/routes/(dashboard)/_components/product-performance'
import { RevenueChart } from '@/routes/(dashboard)/_components/revenue-chart'
import { StatCard } from '@/routes/(dashboard)/_components/stat-card'

export default function HomePage() {
  return (
    <>
      <Typography variant='h2'>Dashboard</Typography>
      <Typography className='text-muted-foreground'>
        Welcome back! Here&apos;s your business performance overview.
      </Typography>

      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4'>
        <h3 className='sr-only'>Key Statistics section</h3>

        {statisticsData.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className='grid grid-cols-1 lg:grid-cols-3 gap-4 my-4'>
        <h3 className='sr-only'>Revenue and Category Distribution section</h3>

        <RevenueChart config={revenueConfig} data={revenueData} />
        <CategoryDistributionChart
          config={categoryConfig}
          data={categoryData}
        />
      </section>

      <section className='grid grid-cols-1 lg:grid-cols-2 gap-4 my-4'>
        <h3 className='sr-only'>
          Orders, Customers and Product Performance section
        </h3>

        <OrdersAndCustomers config={ordersConfig} data={ordersData} />
        <ProductPerformance
          config={productPerformanceConfig}
          data={productPerformanceData}
        />
      </section>
    </>
  )
}

const statisticsData = [
  {
    title: 'Total Revenue',
    value: '$142,500',
    change: '+12.5%',
    icon: DollarSignIcon,
    isPositive: true,
  },
  {
    title: 'Total Orders',
    value: '1,849',
    change: '+8.2%',
    icon: ShoppingCartIcon,
    isPositive: true,
  },
  {
    title: 'New Customers',
    value: '428',
    change: '+4.3%',
    icon: UsersIcon,
    isPositive: true,
  },
  {
    title: 'Avg Order Value',
    value: '$77.08',
    change: '-2.1%',
    icon: TrendingUpIcon,
    isPositive: false,
  },
]

const revenueConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--color-chart-3)',
  },
  target: {
    label: 'Target',
    color: 'var(--color-chart-4)',
  },
} satisfies ChartConfig

const revenueData = [
  { month: 'Jan', revenue: 12000, target: 15000 },
  { month: 'Feb', revenue: 19000, target: 15000 },
  { month: 'Mar', revenue: 15000, target: 15000 },
  { month: 'Apr', revenue: 22000, target: 15000 },
  { month: 'May', revenue: 28000, target: 15000 },
  { month: 'Jun', revenue: 35000, target: 15000 },
]

const categoryConfig = {
  electronics: {
    label: 'Electronics',
    color: 'var(--color-chart-1)',
  },
  fashion: {
    label: 'Fashion',
    color: 'var(--color-chart-2)',
  },
  home: {
    label: 'Home',
    color: 'var(--color-chart-3)',
  },
  sports: {
    label: 'Sports',
    color: 'var(--color-chart-4)',
  },
  other: {
    label: 'Other',
    color: 'var(--color-chart-5)',
  },
} satisfies ChartConfig

const categoryData = [
  { name: 'Electronics', value: 35, fill: categoryConfig.electronics.color },
  { name: 'Fashion', value: 25, fill: categoryConfig.fashion.color },
  { name: 'Home', value: 20, fill: categoryConfig.home.color },
  { name: 'Sports', value: 15, fill: categoryConfig.sports.color },
  { name: 'Other', value: 5, fill: categoryConfig.other.color },
]

const ordersConfig = {
  orders: {
    label: 'Orders',
    color: 'var(--color-chart-2)',
  },
  customers: {
    label: 'Customers',
    color: 'var(--color-chart-4)',
  },
} satisfies ChartConfig

const ordersData = [
  { date: '01', orders: 240, customers: 180 },
  { date: '02', orders: 290, customers: 210 },
  { date: '03', orders: 200, customers: 150 },
  { date: '04', orders: 350, customers: 280 },
  { date: '05', orders: 420, customers: 350 },
  { date: '06', orders: 480, customers: 400 },
  { date: '07', orders: 520, customers: 450 },
]

const productPerformanceConfig = {
  sales: {
    label: 'Sales',
    color: 'var(--color-chart-2)',
  },
  revenue: {
    label: 'Revenue',
    color: 'var(--color-chart-4)',
  },
} satisfies ChartConfig

const productPerformanceData = [
  { product: 'Product A', sales: 4200, revenue: 24000 },
  { product: 'Product B', sales: 3800, revenue: 21200 },
  { product: 'Product C', sales: 2500, revenue: 15000 },
  { product: 'Product D', sales: 2800, revenue: 16800 },
  { product: 'Product E', sales: 2100, revenue: 12600 },
]
