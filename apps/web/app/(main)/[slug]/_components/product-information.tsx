import { StarIcon } from '@yukinu/ui/icons'
import { Label } from '@yukinu/ui/label'
import { RadioGroup, RadioGroupItem } from '@yukinu/ui/radio-group'

import { AddToCartButton } from '@/app/(main)/[slug]/_components/add-to-cart-button'
import { usePage } from '@/app/(main)/[slug]/page.provider'

export const ProductInformation: React.FC = () => {
  const {
    product: { category, name, price, sold, variants, reviews },
    avgRating,
    optionTypes,
    selectedOptions,
    selectedVariant,
    handleOptionChange,
  } = usePage()

  return (
    <section className='flex flex-col gap-6 overflow-hidden md:col-span-2'>
      {category && (
        <span className='text-sm text-accent-foreground'>{category.name}</span>
      )}

      <h3 className='text-3xl font-medium text-balance'>{name}</h3>

      <div className='flex items-center gap-4'>
        <span className='flex items-center gap-1 font-medium'>
          <StarIcon className='size-4' />
          {avgRating.toFixed(1)}
        </span>

        <hr className='h-6 w-0.5 bg-border' />

        <span className='text-sm font-medium'>
          {reviews.length} Review{reviews.length !== 1 && 's'}
        </span>

        <hr className='h-6 w-0.5 bg-border' />

        <span className='text-sm font-medium'>{sold} Sold</span>
      </div>

      <p className='mb-4 text-2xl font-semibold text-accent-foreground'>
        ${selectedVariant ? selectedVariant.price : price}
      </p>

      <section className='flex-1'>
        <h4 className='sr-only'>Purchase Options section</h4>

        <ul className='mb-4 flex flex-col gap-4'>
          {optionTypes.map((type) => (
            <li key={type} className='flex items-baseline gap-4'>
              <p className='font-medium capitalize'>{type}</p>

              <RadioGroup
                className='flex flex-wrap'
                value={selectedOptions[type]}
                onValueChange={(value) => {
                  handleOptionChange(type, value)
                }}
              >
                {Array.from(
                  new Set(
                    variants
                      .map((v) => v.options.find((o) => o.name === type)?.value)
                      .filter(Boolean),
                  ),
                ).map((value, idx) => (
                  <Label
                    // eslint-disable-next-line @eslint-react/no-array-index-key
                    key={`${type}-option-${value}-${idx}`}
                    htmlFor={`${type}-option-${value}`}
                    className='flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/20 has-aria-checked:border-primary has-aria-checked:bg-primary/20'
                  >
                    <RadioGroupItem
                      id={`${type}-option-${value}`}
                      value={value ?? ''}
                      hidden
                    />

                    {value}
                  </Label>
                ))}
              </RadioGroup>
            </li>
          ))}
        </ul>
      </section>

      <AddToCartButton />
    </section>
  )
}
