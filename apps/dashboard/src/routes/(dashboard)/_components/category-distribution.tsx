import type { ChartConfig } from '@yukinu/ui/chart'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@yukinu/ui/card'
import {
  PieChart,
  ChartContainer,
  ResponsiveContainer,
  ChartTooltip,
  ChartTooltipContent,
  Pie,
  Cell,
  LabelList,
} from '@yukinu/ui/chart'

export const CategoryDistributionChart: React.FC<{
  config: ChartConfig
  data: Array<{ name: string; value: number; fill: string }>
}> = ({ config, data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Sales by Category</CardTitle>
      <CardDescription>Distribution breakdown</CardDescription>
    </CardHeader>
    <CardContent className='flex justify-center'>
      <ChartContainer config={config} className='h-72'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              labelLine
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              dataKey='value'
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
)
