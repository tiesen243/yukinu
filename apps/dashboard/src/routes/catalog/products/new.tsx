import { Typography } from '@yukinu/ui/typography'

import { SaveProductForm } from '@/routes/catalog/products/_components/save-product-form'

export default function CatalogProductsNewPage() {
  return (
    <>
      <Typography variant='h2'>Create New Product</Typography>
      <Typography className='text-muted-foreground'>
        Fill out the form below to create a new product in your catalog. Provide
        detailed information about the product, including its name, description,
        price, category, and inventory details. Once created, you can manage and
        edit the product as needed.
      </Typography>

      <SaveProductForm />
    </>
  )
}
