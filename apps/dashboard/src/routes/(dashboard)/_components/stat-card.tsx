import type { LucideIcon } from '@yukinu/ui/icons'

import { Card, CardContent, CardHeader, CardTitle } from '@yukinu/ui/card'
import { ArrowDownLeftIcon, ArrowUpRightIcon } from '@yukinu/ui/icons'

interface StatCardProps {
  title: string
  value: string | number
  change: string | number
  icon: LucideIcon
  isPositive: boolean
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  isPositive,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <Icon className='size-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold text-card-foreground'>{value}</div>
        <p
          className={`mt-1 flex items-center gap-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}
        >
          {isPositive ? (
            <ArrowUpRightIcon className='size-3' />
          ) : (
            <ArrowDownLeftIcon className='size-3' />
          )}
          {change} from last month
        </p>
      </CardContent>
    </Card>
  )
}
