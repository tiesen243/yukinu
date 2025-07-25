export const MAX_ITEMS_DISPLAY = 2

export const SHIPPING = 9.99
export const TAX = 0.08

export const statusConfig = {
  pending: {
    label: 'Pending',
    variant: 'warning',
    description: 'Your order is being processed',
  },
  paid: {
    label: 'Paid',
    variant: 'info',
    description: 'Payment confirmed, preparing for shipment',
  },
  shipped: {
    label: 'Shipped',
    variant: 'info',
    description: 'Your order is on its way',
  },
  delivered: {
    label: 'Delivered',
    variant: 'success',
    description: 'Order has been delivered',
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'error',
    description: 'Order has been cancelled',
  },
} as const

export const orderTimeline = {
  pending: [
    { status: 'pending', label: 'Order Placed', completed: true },
    { status: 'paid', label: 'Payment Confirmed', completed: false },
    { status: 'shipped', label: 'Shipped', completed: false },
    { status: 'delivered', label: 'Delivered', completed: false },
  ],
  paid: [
    { status: 'pending', label: 'Order Placed', completed: true },
    { status: 'paid', label: 'Payment Confirmed', completed: true },
    { status: 'shipped', label: 'Shipped', completed: false },
    { status: 'delivered', label: 'Delivered', completed: false },
  ],
  shipped: [
    { status: 'pending', label: 'Order Placed', completed: true },
    { status: 'paid', label: 'Payment Confirmed', completed: true },
    { status: 'shipped', label: 'Shipped', completed: true },
    { status: 'delivered', label: 'Delivered', completed: false },
  ],
  delivered: [
    { status: 'pending', label: 'Order Placed', completed: true },
    { status: 'paid', label: 'Payment Confirmed', completed: true },
    { status: 'shipped', label: 'Shipped', completed: true },
    { status: 'delivered', label: 'Delivered', completed: true },
  ],
  cancelled: [
    { status: 'pending', label: 'Order Placed', completed: true },
    { status: 'cancelled', label: 'Order Cancelled', completed: true },
  ],
} as const
