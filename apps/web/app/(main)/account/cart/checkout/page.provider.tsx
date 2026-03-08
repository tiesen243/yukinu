'use client'

import type { PaymentMethod } from '@yukinu/validators/order'

import * as React from 'react'

interface PageContextValue {
  addressId: string
  setAddressId: React.Dispatch<
    React.SetStateAction<PageContextValue['addressId']>
  >

  paymentMethod: PaymentMethod
  setPaymentMethod: React.Dispatch<
    React.SetStateAction<PageContextValue['paymentMethod']>
  >

  voucher: {
    discountAmount: string | null
    discountPercentage: number | null
  }
  setVoucher: React.Dispatch<React.SetStateAction<PageContextValue['voucher']>>
}

const PageContext = React.createContext<PageContextValue | null>(null)

function PageProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [addressId, setAddressId] =
    React.useState<PageContextValue['addressId']>('')
  const [paymentMethod, setPaymentMethod] =
    React.useState<PaymentMethod>('cash_on_delivery')
  const [voucher, setVoucher] = React.useState<PageContextValue['voucher']>({
    discountAmount: null,
    discountPercentage: null,
  })

  const value = React.useMemo(
    () => ({
      addressId,
      setAddressId,
      paymentMethod,
      setPaymentMethod,
      voucher,
      setVoucher,
    }),
    [
      addressId,
      setAddressId,
      paymentMethod,
      setPaymentMethod,
      voucher,
      setVoucher,
    ],
  )

  return <PageContext value={value}>{children}</PageContext>
}

const usePage = () => {
  const context = React.use(PageContext)
  if (!context) throw new Error('usePage must be used within a PageProvider')
  return context
}

export { PageProvider, usePage }
