import type { ChartConfig } from '@yukinu/ui/chart'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yukinu/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@yukinu/ui/chart'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

export const OrdersAndCustomers: React.FC<{
  config: ChartConfig
  data: { date: string; orders: number; customers: number }[]
}> = ({ config, data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Orders & Customers</CardTitle>
      <CardDescription>Daily orders and customer acquisition</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={config} className='h-72 w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray='3 3' stroke='var(--color-border)' />
            <XAxis dataKey='date' stroke='var(--color-muted-foreground)' />
            <YAxis stroke='var(--color-muted-foreground)' />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey='orders' fill={config.orders?.color} />
            <Bar dataKey='customers' fill={config.customers?.color} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
)
