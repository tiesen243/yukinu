import { useQuery } from '@tanstack/react-query'
import { Typography } from '@yukinu/ui/typography'

import { useTRPC } from '@/lib/trpc'
import { UpdateVendorForm } from '@/routes/merchant/my-store/_components/update-vendor-form'

export default function MerchantMyStoreIndexPage() {
  const { trpc } = useTRPC()
  const { data, isLoading, error } = useQuery(
    trpc.merchant.vendor.me.queryOptions(),
  )

  return (
    <>
      <Typography variant='h2'>My Store</Typography>
      <Typography className='text-muted-foreground'>
        Welcome to your store dashboard! Here you can manage your products, view
        orders, and customize your storefront. Use the navigation menu to access
        different sections of your store and keep track of your business
        performance.
      </Typography>

      {isLoading && <Typography>Loading...</Typography>}
      {!isLoading && !data && (
        <Typography className='text-destructive'>{error?.message}</Typography>
      )}

      {!isLoading && data && <UpdateVendorForm vendor={data} />}
    </>
  )
}
