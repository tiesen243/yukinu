'use client'

import { useQuery } from '@tanstack/react-query'
import { formatDate } from '@yukinu/lib/utils'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@yukinu/ui/item'

import { useTRPC } from '@/lib/trpc'

export const TransactionsHistory: React.FC = () => {
  const { trpc } = useTRPC()
  const { data } = useQuery(trpc.finance.transaction.allByUser.queryOptions({}))
  if (!data) return <p>No transactions found.</p>

  return data.map((transaction) => (
    <Item key={transaction.id} variant='outline'>
      <ItemHeader>
        <ItemTitle>{transaction.referenceNumber}</ItemTitle>
        <ItemDescription>
          {formatDate(transaction.transactionDate ?? new Date())}
        </ItemDescription>
      </ItemHeader>
      <ItemContent>
        <p>Gateway: {transaction.gateway}</p>
        <p>Amount In: {transaction.amountIn}</p>
        <p>Amount Out: {transaction.amountOut}</p>
      </ItemContent>
    </Item>
  ))
}
