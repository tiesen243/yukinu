export const TAX_RATE = 0.1
export const SHIPPING_COST = 5

export const ORDER_STATUS_COLORS = {
  pending: 'warning',
  confirmed: 'info',
  shipped: 'info',
  delivered: 'warning',
  received: 'success',
  completed: 'success',
  cancelled: 'destructive',
} as const

export const PAYMENT_STATUS_COLORS = {
  pending: 'warning',
  success: 'success',
  failed: 'destructive',
} as const
