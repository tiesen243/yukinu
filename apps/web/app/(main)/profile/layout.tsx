import Link from 'next/link'

import {
  CreditCardIcon,
  MapPinIcon,
  PackageIcon,
  UserIcon,
} from '@yukinu/ui/icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@yukinu/ui/tabs'

export default function ProfileLayout({
  children,
  account,
  payment,
  orders,
  addresses,
}: LayoutProps<'/profile'>) {
  return (
    <main className='container py-4'>
      <h1 className='sr-only'>User Profile Page</h1>

      {children}

      <Tabs defaultValue='account' asChild>
        <section>
          <h2 className='sr-only'>Profile Navigation Tabs</h2>

          <TabsList className='w-full sm:w-fit'>
            <TabsTrigger value='account' asChild>
              <Link href='/profile'>
                <UserIcon /> Account
              </Link>
            </TabsTrigger>
            <TabsTrigger value='addresses' asChild>
              <Link href='/profile/addresses'>
                <MapPinIcon /> Addresses
              </Link>
            </TabsTrigger>
            <TabsTrigger value='orders' asChild>
              <Link href='/profile/orders'>
                <PackageIcon /> Orders
              </Link>
            </TabsTrigger>
            <TabsTrigger value='payment' asChild>
              <Link href='/profile/payment'>
                <CreditCardIcon /> Payment Methods
              </Link>
            </TabsTrigger>
          </TabsList>

          <TabsContent value='orders'>{orders}</TabsContent>
          <TabsContent value='addresses'>{addresses}</TabsContent>
          <TabsContent value='payment'>{payment}</TabsContent>
          <TabsContent value='account'>{account}</TabsContent>
        </section>
      </Tabs>
    </main>
  )
}
