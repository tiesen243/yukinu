'use client'

import * as React from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'

import type { ProductValidators } from '@yukinu/validators/product'

import { useTRPC } from '@/lib/trpc/react'

const PageContext = React.createContext<{
  product: ProductValidators.OneOutput
  optionTypes: string[]

  avgRating: number
  currentImage: string | undefined
  selectedOptions: Record<string, string>
  selectedVariant: ProductValidators.OneOutput['variants'][number] | undefined

  handleChangeImage: (url: string) => void
  handleOptionChange: (type: string, value: string) => void
} | null>(null)

interface PageProviderProps {
  children: React.ReactNode
  id: string
}

function PageProvider({ children, id }: Readonly<PageProviderProps>) {
  const trpc = useTRPC()
  const { data: product } = useSuspenseQuery(
    trpc.product.one.queryOptions({ id }),
  )

  const [currentImage, setCurrentImage] = React.useState(
    product.images.at(0)?.url,
  )

  const handleChangeImage = React.useCallback((url: string) => {
    setCurrentImage(url)
  }, [])

  const optionTypes = Array.from(
    new Set(product.variants.flatMap((v) => v.options.map((o) => o.name))),
  )

  const [selectedOptions, setSelectedOptions] = React.useState(() =>
    Object.fromEntries(
      optionTypes.map((type) => [
        type,
        product.variants
          .find((v) => v.options.some((o) => o.name === type))
          ?.options.find((o) => o.name === type)?.value ?? '',
      ]),
    ),
  )

  const handleOptionChange = React.useCallback(
    (type: string, value: string) => {
      setSelectedOptions((prev) => ({
        ...prev,
        [type]: value,
      }))
    },
    [],
  )

  const value = React.useMemo(() => {
    const selectedVariant = product.variants.find((variant) =>
      optionTypes.every((type) =>
        variant.options.some(
          (o) => o.name === type && o.value === selectedOptions[type],
        ),
      ),
    )

    const avgRating = product.reviews.length
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length
      : 0

    return {
      product,
      optionTypes,

      avgRating,
      currentImage,
      selectedOptions,
      selectedVariant,

      handleChangeImage,
      handleOptionChange,
    }
  }, [
    currentImage,
    handleChangeImage,
    handleOptionChange,
    optionTypes,
    product,
    selectedOptions,
  ])

  return <PageContext value={value}>{children}</PageContext>
}

const usePage = () => {
  const context = React.use(PageContext)
  if (context === null)
    throw new Error('usePage must be used within a PageProvider')
  return context
}

export { PageProvider, usePage }
