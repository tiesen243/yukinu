import { Card } from '@yukinu/ui/card'
import * as React from 'react'

import { ProductDescription } from '@/app/(main)/[slug]/_components/product-description'
import { ProductImages } from '@/app/(main)/[slug]/_components/product-images'
import { ProductInformation } from '@/app/(main)/[slug]/_components/product-information'
import { ProductReviews } from '@/app/(main)/[slug]/_components/product-reviews'
import { ProductVendor } from '@/app/(main)/[slug]/_components/product-vendor'

export const ProductDetails: React.FC = () => {
  return (
    <>
      <Card className='grid px-4 md:grid-cols-3' render={<section />}>
        <h2 className='sr-only'>Product Details section</h2>

        <ProductImages />

        <ProductInformation />
      </Card>

      <ProductVendor />

      <ProductDescription />

      <ProductReviews />
    </>
  )
}
