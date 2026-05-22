'use client'

import { Button } from '@yukinu/ui/button'
import { HeartIcon, MinusIcon, PlusIcon } from '@yukinu/ui/icons'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@yukinu/ui/input-group'
import { useState } from 'react'

import { usePage } from '@/app/(main)/[slug]/page.provider'

export const AddToCartButton: React.FC = () => {
  const {
    product: { variants, stock, isWishlisted },
    selectedVariant,
    toggleWishlistItem,
    isTogglingWishlistItem,
    addItemToCart,
    isAddingItemToCart,
  } = usePage()
  const [quantity, setQuantity] = useState(1)

  return (
    <section className='flex flex-col gap-4'>
      <h4 className='sr-only'>Add to Cart section</h4>

      <div className='flex items-center gap-4'>
        <InputGroup>
          <InputGroupAddon align='inline-start'>
            <InputGroupButton
              onClick={() => {
                if (variants.length > 0 ? !selectedVariant : stock === 0) return
                if (quantity > 1) setQuantity((prev) => prev - 1)
              }}
            >
              <MinusIcon />
              <span className='sr-only'>Decrease quantity</span>
            </InputGroupButton>
          </InputGroupAddon>

          <InputGroupInput
            aria-label='Quantity'
            value={quantity}
            disabled={variants.length > 0 ? !selectedVariant : stock === 0}
            onChange={(e) => {
              const qty = Number.parseInt(e.target.value, 10)
              let maxStock: number = stock
              if (variants.length > 0)
                maxStock = selectedVariant ? selectedVariant.stock : 0
              if (!maxStock) return

              if (Number.isNaN(qty) || qty < 1) setQuantity(1)
              else if (qty > maxStock) setQuantity(maxStock)
              else setQuantity(qty)
            }}
          />

          <InputGroupAddon align='inline-end'>
            <InputGroupButton
              onClick={() => {
                let maxStock: number = stock
                if (variants.length > 0)
                  maxStock = selectedVariant ? selectedVariant.stock : 0
                if (!maxStock) return
                if (quantity < maxStock) setQuantity((prev) => prev + 1)
              }}
            >
              <PlusIcon />
              <span className='sr-only'>Increase quantity</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <p className='text-sm whitespace-nowrap text-muted-foreground'>
          {variants.length &&
            (selectedVariant
              ? `${selectedVariant.stock} items available`
              : 'This option is unavailable')}
          {!variants.length && `${stock} items available`}
        </p>
      </div>

      <div className='flex w-full items-center gap-2'>
        <Button
          className='flex-1'
          onClick={() => addItemToCart(quantity)}
          disabled={
            isAddingItemToCart ||
            (variants.length > 0
              ? !selectedVariant || selectedVariant.stock === 0
              : stock === 0)
          }
        >
          {isAddingItemToCart ? 'Adding...' : 'Add to Cart'}
        </Button>

        <Button
          variant='outline'
          size='icon'
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={toggleWishlistItem}
          disabled={isTogglingWishlistItem}
        >
          <HeartIcon
            className={
              isWishlisted ? 'fill-destructive stroke-destructive' : ''
            }
          />
        </Button>
      </div>
    </section>
  )
}
