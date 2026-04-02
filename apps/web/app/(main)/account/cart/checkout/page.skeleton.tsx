import { Button } from '@yukinu/ui/button'
import { CheckCircle2Icon } from '@yukinu/ui/icons'
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from '@yukinu/ui/item'
import { RadioGroup, RadioGroupItem } from '@yukinu/ui/radio-group'
import Image from 'next/image'

export const OrderItemsSkeleton: React.FC = () =>
  Array.from({ length: 3 }, (_, i) => (
    <Item
      key={i}
      variant='outline'
      className='animate-pulse hover:bg-muted dark:hover:bg-muted/50'
    >
      <ItemMedia variant='image'>
        <Image
          src='/assets/favicon.svg'
          alt={`thumbnail of product ${i + 1}`}
          className='h-20 w-20 rounded-md object-cover'
          width={80}
          height={80}
        />
      </ItemMedia>
      <ItemContent className='flex-1'>
        <ItemTitle className='w-1/3 rounded-sm bg-muted'>&nbsp;</ItemTitle>
        <ItemDescription className='w-1/2 rounded-sm bg-muted'>
          &nbsp;
        </ItemDescription>
      </ItemContent>

      <ItemContent className='flex flex-col items-end'>
        <ItemTitle className='w-20 rounded-sm bg-muted text-lg'>
          &nbsp;
        </ItemTitle>
        <ItemDescription className='w-24 rounded-sm bg-muted'>
          &nbsp;
        </ItemDescription>
      </ItemContent>
    </Item>
  ))

export const AddressSelectorSkeleton: React.FC = () =>
  Array.from({ length: 2 }, (_, i) => (
    <label
      key={i}
      htmlFor={`addr-${i}`}
      className='relative flex animate-pulse cursor-pointer items-start gap-4 rounded-lg border border-border p-4 transition-all hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5'
    >
      <RadioGroup className='w-fit' disabled>
        <RadioGroupItem id={`addr-${i}`} value={i} />
      </RadioGroup>
      <div className='-mt-1 min-w-0 flex-1'>
        <p className='block w-1/3 rounded-sm bg-muted text-sm'>&nbsp;</p>
        <p className='mt-2 rounded-sm bg-muted text-xs leading-relaxed text-muted-foreground'>
          &nbsp; <br />
          &nbsp;
        </p>
      </div>
    </label>
  ))

export const CheckoutSkeleton = () => (
  <>
    <div className='mb-6 animate-pulse space-y-4'>
      <div className='flex justify-between text-sm'>
        <span className='text-muted-foreground'>Subtotal</span>
        <span className='w-20 rounded-sm bg-muted font-medium'>&nbsp;</span>
      </div>

      <div className='flex animate-pulse justify-between text-sm'>
        <span className='text-muted-foreground'>Taxes</span>
        <span className='w-20 rounded-sm bg-muted font-medium'>&nbsp;</span>
      </div>

      <div className='flex animate-pulse justify-between text-sm'>
        <span className='text-muted-foreground'>Shipping</span>
        <span className='w-20 rounded-sm bg-muted font-medium'>&nbsp;</span>
      </div>
    </div>

    <hr className='my-6' />

    <div className='mb-6 animate-pulse'>
      <p className='mb-2 text-xs font-semibold text-muted-foreground'>
        Total Amount
      </p>
      <p className='w-32 rounded-sm bg-muted text-3xl font-bold'>&nbsp;</p>
    </div>

    <Button size='lg' className='w-full' disabled>
      <CheckCircle2Icon />
      Complete Purchase
    </Button>
  </>
)
