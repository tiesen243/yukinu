'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  BanIcon,
  CalendarIcon,
  CreditCardIcon,
  MapPinIcon,
  PackageIcon,
  PhoneIcon,
  TruckIcon,
  UserIcon,
} from 'lucide-react'

import { cn } from '@yuki/ui'
import { Badge } from '@yuki/ui/badge'
import { Button } from '@yuki/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@yuki/ui/card'
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@yuki/ui/responsive-dialog'
import { toast } from '@yuki/ui/sonner'

import {
  orderTimeline,
  paymentStatusConfig,
  statusConfig,
} from '@/app/(main)/account/orders/_config'
import { SHIPPING, TAX } from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/helpers'
import { slugify } from '@/lib/utils'
import { useTRPC } from '@/trpc/react'

export const OrderDetail: React.FC<{ id: string }> = (props) => {
  const { trpc, queryClient } = useTRPC()

  const { data } = useSuspenseQuery(trpc.order.byId.queryOptions(props))

  const { mutate, isPending } = useMutation({
    ...trpc.order.update.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.order.all.queryFilter())
      await queryClient.invalidateQueries(trpc.order.byId.queryFilter(props))
      toast.success('Order updated successfully!')
    },
    onError: (error) => toast.error(error.message),
  })

  const statusInfo = statusConfig[data.status]
  const timeline = orderTimeline[data.status]
  const subtotal = data.orderItems.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.price),
    0,
  )

  const paymentAmount = parseFloat(data.payment?.amount ?? '0')
  const paymentStatus = data.payment?.status ?? 'pending'
  const paymentMethod = data.payment?.method ?? 'bank_transfer'

  return (
    <section className='grid gap-6 lg:grid-cols-3'>
      <div className='space-y-6 lg:col-span-2'>
        <Card>
          <CardHeader className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <PackageIcon className='size-5' /> Order Status
            </CardTitle>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </CardHeader>

          <CardContent>
            <CardDescription className='mb-4'>
              {statusInfo.description}
            </CardDescription>

            <div className='space-y-4'>
              {timeline.map((step) => (
                <div key={step.status} className='flex items-center gap-3'>
                  <div
                    className={cn(
                      'size-3 rounded-full',
                      step.completed ? 'bg-green-500' : 'bg-gray-300',
                    )}
                  />
                  <span
                    className={cn(
                      'text-sm',
                      step.completed
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground',
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CreditCardIcon className='size-5' /> Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>Status:</span>
              <Badge variant={paymentStatusConfig[paymentStatus].variant}>
                {paymentStatusConfig[paymentStatus].label}
              </Badge>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>Method:</span>
              <span className='text-sm font-medium capitalize'>
                {data.payment?.method.replace(/_/g, ' ')}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>Amount:</span>
              <span className='text-sm font-medium'>
                {formatCurrency(paymentAmount)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4'>
            {data.orderItems.map((item) => (
              <Link
                key={`${item.orderId}-${item.productId}`}
                href={`/${slugify(item.product.name)}-${item.product.id}`}
                className='flex gap-4 rounded-lg border p-4'
              >
                <div className='relative size-20 flex-shrink-0 overflow-hidden rounded-md border'>
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    className='object-cover'
                    fill
                  />
                </div>

                <div className='flex-1 space-y-2'>
                  <h4 className='font-semibold'>{item.product.name}</h4>
                  <p className='line-clamp-2 text-sm text-muted-foreground'>
                    {item.product.description}
                  </p>
                  <div className='flex items-center gap-4 text-sm'>
                    <span>Qty: {item.quantity}</span>
                    <span>Price: {formatCurrency(item.price)}</span>
                    {item.product.discount > 0 && (
                      <Badge variant='secondary'>
                        {item.product.discount}% off
                      </Badge>
                    )}
                  </div>
                </div>

                <div className='text-right'>
                  <div className='font-semibold'>
                    {formatCurrency(item.quantity * parseFloat(item.price))}
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MapPinIcon className='size-5' /> Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-center gap-2'>
              <UserIcon className='size-4 text-muted-foreground' />
              <span className='font-medium'>{data.address.name}</span>
            </div>

            <div className='flex items-center gap-2'>
              <PhoneIcon className='size-4 text-muted-foreground' />
              <span className='text-sm'>{data.address.phone}</span>
            </div>

            <div className='flex gap-2'>
              <MapPinIcon className='size-4 shrink-0 text-muted-foreground' />
              <p className='text-sm'>
                <span>{data.address.line1}, </span>
                {data.address.line2 && <span>{data.address.line2}, </span>}
                <span>
                  {data.address.city}, {data.address.state}
                  {', '}
                  {data.address.postalCode}
                  {', '}
                  {data.address.country}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between text-sm'>
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className='flex justify-between text-sm'>
              <span>Shipping</span>
              <span>{formatCurrency(SHIPPING)}</span>
            </div>

            <div className='flex justify-between text-sm'>
              <span>Tax</span>
              <span>{formatCurrency(subtotal * TAX)}</span>
            </div>

            <hr />

            <div className='flex justify-between font-semibold'>
              <span>Total</span>
              <span>{formatCurrency(paymentAmount)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CalendarIcon className='h-5 w-5' />
              Order Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 text-sm'>
            <div>
              <span className='text-muted-foreground'>Order Date:</span>
              <div className='font-medium'>{formatDate(data.createdAt)}</div>
            </div>
            <div>
              <span className='text-muted-foreground'>Last Updated:</span>
              <div className='font-medium'>{formatDate(data.updatedAt)}</div>
            </div>
            <div>
              <span className='text-muted-foreground'>Order ID:</span>
              <div className='font-mono text-xs'>{data.id}</div>
            </div>
          </CardContent>
        </Card>

        <div className='space-y-3 [&>a]:w-full [&>button]:w-full'>
          {data.status === 'shipped' && (
            <Button>
              <TruckIcon /> Track Order
            </Button>
          )}
          {paymentStatus === 'pending' &&
            paymentMethod !== 'cash_on_delivery' && (
              <Button
                onClick={() => {
                  // TODO: Implement payment logic
                  mutate({ id: data.id, paymentStatus: 'completed' })
                }}
                disabled={isPending}
              >
                <CreditCardIcon /> Pay Now
              </Button>
            )}
          <Button variant='outline' asChild>
            <a
              href='https://youtu.be/9lNZ_Rnr7Jc'
              target='_blank'
              rel='noopener noreferrer'
            >
              <PhoneIcon /> Contact Support
            </a>
          </Button>
          {data.status === 'pending' && (
            <ResponsiveDialog>
              <ResponsiveDialogTrigger asChild>
                <Button variant='destructive'>
                  <BanIcon /> Cancel Order
                </Button>
              </ResponsiveDialogTrigger>

              <ResponsiveDialogContent>
                <ResponsiveDialogHeader>
                  <ResponsiveDialogTitle>
                    Are you sure you want to cancel this order?
                  </ResponsiveDialogTitle>
                  <ResponsiveDialogDescription>
                    Cancelling your order will remove it from your account and
                    you will not be able to recover it. If you have any issues,
                    please contact support.
                  </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <ResponsiveDialogFooter className='flex-col-reverse'>
                  <ResponsiveDialogClose asChild>
                    <Button variant='secondary' disabled={isPending}>
                      Cancel
                    </Button>
                  </ResponsiveDialogClose>
                  <Button
                    variant='destructive'
                    onClick={() => {
                      mutate({ id: data.id, orderStatus: 'cancelled' })
                    }}
                    disabled={isPending}
                  >
                    Confirm Cancellation
                  </Button>
                </ResponsiveDialogFooter>
              </ResponsiveDialogContent>
            </ResponsiveDialog>
          )}
        </div>
      </div>
    </section>
  )
}
