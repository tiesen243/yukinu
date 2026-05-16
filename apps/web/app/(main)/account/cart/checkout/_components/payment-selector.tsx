'use client'

import {
  FieldLabel,
  Field,
  FieldContent,
  FieldTitle,
  FieldDescription,
} from '@yukinu/ui/field'
import { RadioGroup, RadioGroupItem } from '@yukinu/ui/radio-group'

import { usePage } from '@/app/(main)/account/cart/checkout/page.provider'

export function PaymentMethodSelector() {
  const { paymentMethod, setPaymentMethod } = usePage()

  const methods = [
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Transfer directly from your bank account',
    },
    {
      id: 'cash_on_delivery',
      name: 'Cash on Delivery',
      description: 'Pay with cash upon delivery',
    },
  ]

  return (
    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
      {methods.map((method) => (
        <FieldLabel key={method.id} htmlFor={method.id}>
          <Field orientation='horizontal'>
            <RadioGroupItem id={method.id} value={method.id} />
            <FieldContent>
              <FieldTitle>{method.name}</FieldTitle>
              <FieldDescription>{method.description}</FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  )
}
