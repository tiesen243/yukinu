import { Typography } from '@yukinu/ui/typography'
import { utapi } from '@yukinu/uploadthing'

import { SaveProductForm } from '@/routes/catalog/products/_components/save-product-form'

import type { Route } from './+types/new'

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData()
  const image = formData.get('image')
  if (typeof image !== 'string') return new Response(null, { status: 400 })

  await utapi.deleteFiles(String(image).split('/').pop() ?? '')
  return new Response(null, { status: 204 })
}

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
