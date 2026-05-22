'use client'

import { useQuery } from '@tanstack/react-query'
import { Alert, AlertDescription, AlertTitle } from '@yukinu/ui/alert'
import { Badge } from '@yukinu/ui/badge'
import { Button } from '@yukinu/ui/button'
import {
  CheckCircle2Icon,
  ClockIcon,
  CopyCheckIcon,
  CopyIcon,
  TriangleAlertIcon,
} from '@yukinu/ui/icons'
import { Typography } from '@yukinu/ui/typography'
import Image from 'next/image'
import { useState } from 'react'

import { env } from '@/lib/env'
import { useTRPC } from '@/lib/trpc'

export const PaymentDetails: React.FC<{ paymentId: string }> = ({
  paymentId,
}) => {
  const { trpc } = useTRPC()
  const { data, status } = useQuery({
    ...trpc.finance.payment.one.queryOptions({ id: paymentId }),
    refetchInterval: (query) =>
      query.state.data?.status === 'success' ? false : 5000,
    refetchIntervalInBackground: true,
  })

  if (status !== 'success') return null

  /* oxlint-disable-next-line no-warning-comments
    TODO: Switch back to `data.amount` when going to production.
    Currently hardcoded to 2,000 VND for demo environment because banks
    enforce a minimum transfer limit of 2,000 VND per transaction. 
  */
  const amount = env.NEXT_PUBLIC_SEPAY_DEMO === 'true' ? 2000 : data.amount

  const qrUrl = `https://qr.sepay.vn/img?acc=${env.NEXT_PUBLIC_BANK_ACCOUNT}&bank=${env.NEXT_PUBLIC_BANK_NAME}&amount=${amount}&des=SEVQR+TKPYKN+PM${paymentId}&template=compact`

  const statusConfig = {
    pending: {
      icon: ClockIcon,
      variant: 'warning',
      label: 'Payment Pending',
    },
    success: {
      icon: CheckCircle2Icon,
      variant: 'success',
      label: 'Payment Completed',
    },
    failed: {
      icon: TriangleAlertIcon,
      variant: 'destructive',
      label: 'Payment Failed',
    },
  } as const
  const StatusIcon = statusConfig[data.status].icon

  return (
    <>
      <section className='space-y-4 md:col-span-2'>
        <h2 className='sr-only'>Payment Details section</h2>
        <div className='flex items-center justify-between'>
          <Typography className='font-medium'>Payment Status</Typography>
          <Badge variant={statusConfig[data.status].variant}>
            <StatusIcon />
            {statusConfig[data.status].label}
          </Badge>
        </div>
        <hr className='my-4' />
        <div className='space-y-4'>
          <div>
            <Typography className='text-sm text-muted-foreground'>
              Bank Name
            </Typography>
            <Typography className='text-lg font-semibold'>
              {env.NEXT_PUBLIC_BANK_NAME}
            </Typography>
          </div>

          <div>
            <Typography className='text-sm text-muted-foreground'>
              Account Number
            </Typography>
            <Typography className='inline-flex items-center gap-2 text-lg font-semibold'>
              {env.NEXT_PUBLIC_BANK_ACCOUNT}

              <CopyButton
                title='Copy bank account'
                content={env.NEXT_PUBLIC_BANK_ACCOUNT}
              />
            </Typography>
          </div>

          <div>
            <Typography className='text-sm text-muted-foreground'>
              Content
            </Typography>

            <Typography className='inline-flex items-center gap-2 text-lg font-semibold'>
              SEVQR TKPYKN PM{paymentId}
              <CopyButton
                title='Copy content'
                content={`SEVQR TKPYKN PM${paymentId}`}
              />
            </Typography>
          </div>
        </div>
        <div className='rounded-xl border border-info/20 bg-info/10 px-4 pt-4'>
          <Typography className='text-sm text-muted-foreground'>
            Amount Due
          </Typography>
          <Typography className='text-3xl font-bold text-info'>
            ${data.amount}
          </Typography>
        </div>
        <div>
          <Typography className='text-sm text-muted-foreground'>
            Payment Reference
          </Typography>

          <div className='mt-2 flex items-center gap-2'>
            <Typography variant='code'>{paymentId}</Typography>
            <CopyButton title='Copy payment ID' content={paymentId} />
          </div>
        </div>
      </section>

      <section>
        <h3 className='sr-only'>Payment QR Code and Instructions</h3>
        <div className='relative mb-6 aspect-square w-full rounded-xl border-2 bg-slate-50 p-4'>
          <Image
            src={qrUrl}
            alt='Payment QR Code'
            className='object-contain p-4'
            priority
            fill
          />
        </div>
        <div className='mb-6 w-full space-y-2 [&_p]:text-center'>
          <Typography className='text-sm text-muted-foreground'>
            Amount:
          </Typography>
          <Typography className='text-2xl font-bold text-success'>
            ${data.amount}
          </Typography>
        </div>

        {env.NEXT_PUBLIC_SEPAY_DEMO === 'true' && (
          <>
            <hr className='my-4' />

            <Alert variant='warning'>
              <TriangleAlertIcon className='size-4' />
              <AlertTitle>Demo Environment Active</AlertTitle>
              <AlertDescription>
                The app is in demo mode. Please transfer exactly{' '}
                <strong>2,000 VND</strong> (the bank's minimum requirement)
                instead of the actual order total. The payment status will
                update automatically.
              </AlertDescription>
            </Alert>
          </>
        )}
      </section>
    </>
  )
}

const CopyButton: React.FC<{ title: string; content: string }> = ({
  title,
  content,
}) => {
  const [isCopy, setIsCopy] = useState(false)

  const handleClick = () => {
    setIsCopy(true)
    navigator.clipboard.writeText(content)
    setTimeout(() => setIsCopy(false), 2000)
  }

  return (
    <Button
      variant='outline'
      size='icon-sm'
      title={title}
      aria-label={title}
      onClick={handleClick}
    >
      {isCopy ? (
        <CopyCheckIcon className='text-success' />
      ) : (
        <CopyIcon className='text-muted-foreground' />
      )}
    </Button>
  )
}
