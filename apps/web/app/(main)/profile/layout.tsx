import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@yukinu/auth'
import {
  CreditCardIcon,
  MapPinIcon,
  PackageIcon,
  UserIcon,
} from '@yukinu/ui/icons'
import { TabsContent, TabsList, TabsTrigger } from '@yukinu/ui/tabs'

import { Tabs } from '@/app/(main)/profile/layout.client'

export default async function ProfileLayout({
  children,
  account,
  payment,
  orders,
  addresses,
}: LayoutProps<'/profile'>) {
  const session = await auth({ headers: await headers() })
  if (!session.user) redirect('/login')

  return (
    <main className='container py-4'>
      <h1 className='sr-only'>User Profile Page</h1>
      {children}

      <Tabs asChild>
        <section>
          <h2 className='sr-only'>Profile Navigation Tabs</h2>

          <TabsList className='w-full overflow-x-auto sm:w-fit'>
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

          <TabsContent value='account'>{account}</TabsContent>
          <TabsContent value='addresses'>{addresses}</TabsContent>
          <TabsContent value='orders'>{orders}</TabsContent>
          <TabsContent value='payment'>{payment}</TabsContent>
        </section>
      </Tabs>
    </main>
  )
}
