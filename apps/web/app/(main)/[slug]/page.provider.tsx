'use client'

import type { OneProductDto } from '@yukinu/api/catalog'

import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { toast } from '@yukinu/ui/toast'
import { parseAsString, useQueryStates } from 'nuqs'
import * as React from 'react'

import { useTRPC } from '@/lib/trpc'

const PageContext = React.createContext<{
  product: OneProductDto.Output
  optionTypes: string[]

  avgRating: number
  currentImage: string | undefined
  selectedOptions: Record<string, string | null>
  selectedVariant: OneProductDto.Output['variants'][number] | undefined

  handleChangeImage: (url: string) => void
  handleOptionChange: (type: string, value: string | null) => void

  toggleWishlistItem: () => void
  isTogglingWishlistItem: boolean

  addItemToCart: (quantity: number) => void
  isAddingItemToCart: boolean
} | null>(null)

interface PageProviderProps {
  children: React.ReactNode
  id: string
}

function PageProvider({ children, id }: Readonly<PageProviderProps>) {
  const { trpc, queryClient } = useTRPC()
  const { data: product } = useSuspenseQuery(
    trpc.catalog.product.one.queryOptions({ id }),
  )

  const [currentImage, setCurrentImage] = React.useState(
    product.images.at(0)?.url,
  )

  const handleChangeImage = React.useCallback((url: string) => {
    setCurrentImage(url)
  }, [])

  const optionTypes = React.useMemo(
    () => [
      ...new Set(product.variants.flatMap((v) => v.options.map((o) => o.name))),
    ],
    [product.variants],
  )

  const parsers = Object.fromEntries(
    [...optionTypes].map((key) => [key, parseAsString]),
  )
  const [selectedOptions, setSelectedOptions] = useQueryStates(parsers)

  const handleOptionChange = React.useCallback(
    (type: string, value: string | null) => {
      setSelectedOptions((prev) => ({
        ...prev,
        [type]: value,
      }))
    },
    [setSelectedOptions],
  )

  const { mutate: toggleWishlistItem, isPending: isTogglingWishlistItem } =
    useMutation({
      ...trpc.sales.wishlist.toggle.mutationOptions(),
      meta: { filter: trpc.sales.wishlist.get.queryOptions({}) },

      // Optimistically update the product's wishlist status in the cache
      onMutate: async () => {
        const filter = trpc.catalog.product.one.queryFilter({ id })

        await queryClient.cancelQueries(filter)

        const previousProduct = queryClient.getQueryData(filter.queryKey)
        queryClient.setQueryData(
          filter.queryKey,
          (old) =>
            ({
              ...old,
              isWishlisted: !old?.isWishlisted,
            }) as OneProductDto.Output,
        )

        return { previousProduct }
      },
      onSettled: () =>
        queryClient.invalidateQueries(
          trpc.catalog.product.one.queryFilter({ id }),
        ),

      onSuccess: ({ added }) =>
        toast.success({
          message: added ? 'Added to wishlist' : 'Removed from wishlist',
        }),
      onError: ({ message }, _, context) => {
        toast.error({ message })
        queryClient.setQueriesData(
          trpc.catalog.product.one.queryFilter({ id }),
          context?.previousProduct,
        )
      },
    })

  const { mutate: addItemToCart, isPending: isAddingItemToCart } = useMutation({
    ...trpc.sales.cart.save.mutationOptions(),
    meta: { filter: trpc.sales.cart.get.queryOptions({}) },
    onSuccess: () => toast.success({ message: 'Item added to cart' }),
    onError: ({ message }) => toast.error({ message }),
  })

  const value = React.useMemo(() => {
    const selectedVariant = product.variants.find((variant) =>
      optionTypes.every((type) =>
        variant.options.some(
          (o) => o.name === type && o.value === selectedOptions[type],
        ),
      ),
    )

    const avgRating =
      product.reviews.length > 0
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

      toggleWishlistItem: () => {
        toggleWishlistItem({ productId: product.id })
      },
      isTogglingWishlistItem,

      addItemToCart: (quantity: number) =>
        addItemToCart({
          productId: product.id,
          productVariantId: selectedVariant?.id ?? null,
          quantity,
        }),
      isAddingItemToCart,
    }
  }, [
    addItemToCart,
    currentImage,
    handleChangeImage,
    handleOptionChange,
    isAddingItemToCart,
    isTogglingWishlistItem,
    optionTypes,
    product,
    selectedOptions,
    toggleWishlistItem,
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
