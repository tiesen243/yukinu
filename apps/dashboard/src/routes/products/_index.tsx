import { Typography } from '@yukinu/ui/typography'

import { ProductTable } from '@/routes/products/_components/products-table'

export default function ProductsPage() {
  return (
    <>
      <Typography variant='h2'>Products Management</Typography>
      <Typography className='text-muted-foreground'>
        Manage and view all products in your vendors from this dashboard.
      </Typography>

      <ProductTable />
    </>
  )
}
