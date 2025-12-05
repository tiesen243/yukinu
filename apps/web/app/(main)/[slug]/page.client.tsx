'use client'

import * as React from 'react'

import { ProductDescription } from '@/app/(main)/[slug]/_components/product-description'
import { ProductImages } from '@/app/(main)/[slug]/_components/product-images'
import { ProductInformation } from '@/app/(main)/[slug]/_components/product-information'
import { ProductReviews } from '@/app/(main)/[slug]/_components/product-reviews'
import { ProductVendor } from '@/app/(main)/[slug]/_components/product-vendor'

export const ProductDetails: React.FC = () => {
  return (
    <>
      <section className='grid gap-6 rounded-lg bg-card p-6 shadow-md md:grid-cols-3 dark:border'>
        <h2 className='sr-only'>Product Details section</h2>

        <ProductImages />

        <ProductInformation />
      </section>

      <ProductVendor />

      <ProductDescription />

      <ProductReviews />
    </>
  )
}
