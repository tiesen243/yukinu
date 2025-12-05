import { useState } from 'react'

import { Button } from '@yukinu/ui/button'
import { MinusIcon, PlusIcon } from '@yukinu/ui/icons'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@yukinu/ui/input-group'

import { usePage } from '@/app/(main)/[slug]/page.provider'

export const AddToCartButton: React.FC = () => {
  const { selectedVariant } = usePage()
  const [quantity, setQuantity] = useState(1)

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-4 md:w-1/2'>
        <InputGroup>
          <InputGroupAddon align='inline-start'>
            <InputGroupButton
              onClick={() => {
                if (!selectedVariant) return
                if (quantity > 1) setQuantity((prev) => prev - 1)
              }}
            >
              <MinusIcon />
            </InputGroupButton>
          </InputGroupAddon>

          <InputGroupInput
            value={quantity}
            onChange={(e) => {
              const qty = parseInt(e.target.value, 10)
              if (!selectedVariant) return

              if (isNaN(qty) || qty < 1) setQuantity(1)
              else if (qty > selectedVariant.stock)
                setQuantity(selectedVariant.stock)
              else setQuantity(qty)
            }}
          />

          <InputGroupAddon align='inline-end'>
            <InputGroupButton
              onClick={() => {
                if (!selectedVariant) return
                if (quantity < selectedVariant.stock)
                  setQuantity((prev) => prev + 1)
              }}
            >
              <PlusIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <p className='text-sm whitespace-nowrap text-muted-foreground'>
          {selectedVariant
            ? `${selectedVariant.stock} items available`
            : 'This option is unavailable'}
        </p>
      </div>

      <Button
        className='w-full md:w-1/2'
        disabled={!selectedVariant || selectedVariant.stock < 1}
      >
        Add to Cart
      </Button>
    </div>
  )
}
