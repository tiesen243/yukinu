import { SHIPPING_COST, TAX_RATE } from '@yukinu/lib/constants'
import { formatPrice } from '@yukinu/lib/utils'

export const PaymentSummary: React.FC<{ totalAmount: string }> = ({
  totalAmount,
}) => (
  <section className='flex flex-col gap-4 rounded-lg border bg-muted/30 p-4'>
    <h4 className='sr-only'>Payment Summary section</h4>

    <div className='flex justify-between gap-1 text-muted-foreground'>
      <span>Subtotal:</span>
      <span>{formatPrice(totalAmount)}</span>
    </div>

    <div className='flex justify-between gap-1 text-muted-foreground'>
      <span>Tax ({TAX_RATE * 100}%):</span>
      <span>{formatPrice(Number.parseFloat(totalAmount) * TAX_RATE)}</span>
    </div>

    <div className='flex justify-between gap-1 text-muted-foreground'>
      <span>Shipping / Others:</span>
      <span>{formatPrice(SHIPPING_COST)}</span>
    </div>

    <div className='flex justify-between gap-1 border-t border-dashed pt-1.5 text-base font-bold'>
      <span>Total Amount:</span>
      <span className='text-primary'>
        {formatPrice(totalAmount + SHIPPING_COST)}
      </span>
    </div>
  </section>
)

export const PaymentSummarySkeleton: React.FC = () => (
  <section className='flex animate-pulse flex-col gap-4 rounded-lg border bg-muted/30 p-4'>
    <h4 className='sr-only'>Payment Summary section</h4>

    <div className='flex justify-between gap-1 text-muted-foreground'>
      <span>Subtotal:</span>
      <span className='w-16 rounded bg-muted'>&nbsp;</span>
    </div>

    <div className='flex justify-between gap-1 text-muted-foreground'>
      <span>Tax:</span>
      <span className='w-16 rounded bg-muted'>&nbsp;</span>
    </div>

    <div className='flex justify-between gap-1 text-muted-foreground'>
      <span>Shipping / Others:</span>
      <span className='w-16 rounded bg-muted'>&nbsp;</span>
    </div>

    <div className='flex justify-between gap-1 border-t border-dashed pt-1.5 text-base font-bold'>
      <span>Total Amount:</span>
      <span className='w-16 rounded bg-muted'>&nbsp;</span>
    </div>
  </section>
)
