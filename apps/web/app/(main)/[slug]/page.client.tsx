'use client'

import * as React from 'react'

import { ProductDescription } from '@/app/(main)/[slug]/_components/product-description'
import { ProductImages } from '@/app/(main)/[slug]/_components/product-images'
import { ProductInformation } from '@/app/(main)/[slug]/_components/product-information'
import { ProductReviews } from '@/app/(main)/[slug]/_components/product-reviews'
import { ProductVendor } from '@/app/(main)/[slug]/_components/product-vendor'

export const ProductDetails: React.FC = () => {
  return (
    <section className='space-y-6'>
      <h2 className='sr-only'>Product Details section</h2>

      <section className='grid gap-4 rounded-lg bg-card p-6 shadow-md md:grid-cols-3'>
        <h3 className='sr-only'>Product Information section</h3>

        <ProductImages />

        <ProductInformation />
      </section>

      <ProductVendor />

      <ProductDescription />

      <ProductReviews />
    </section>
  )
}
