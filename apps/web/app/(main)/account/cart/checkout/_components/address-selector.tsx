'use client'

import { useQuery } from '@tanstack/react-query'
import {
  FieldLabel,
  Field,
  FieldContent,
  FieldTitle,
  FieldDescription,
} from '@yukinu/ui/field'
import { RadioGroup, RadioGroupItem } from '@yukinu/ui/radio-group'

import { usePage } from '@/app/(main)/account/cart/checkout/page.provider'
import { useTRPC } from '@/lib/trpc'

export function AddressSelector() {
  const { trpc } = useTRPC()
  const { data, status } = useQuery(trpc.identity.address.all.queryOptions())
  const { addressId, setAddressId } = usePage()

  if (status !== 'success') return <AddressSelectorSkeleton />

  return (
    <RadioGroup value={addressId} onValueChange={setAddressId}>
      {data.map((address) => (
        <FieldLabel key={address.id} htmlFor={address.id}>
          <Field orientation='horizontal'>
            <RadioGroupItem id={address.id} value={address.id} />
            <FieldContent>
              <FieldTitle>{address.recipientName}</FieldTitle>
              <FieldDescription>
                {address.street}, {address.city}, {address.state}{' '}
                {address.postalCode}
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  )
}

const AddressSelectorSkeleton: React.FC = () => (
  <RadioGroup>
    {Array.from({ length: 3 }).map((_, i) => (
      <FieldLabel key={i} htmlFor={`address-skeleton-${i}`}>
        <Field orientation='horizontal'>
          <RadioGroupItem
            id={`address-skeleton-${i}`}
            value={`address-skeleton-${i}`}
            disabled
          />
          <FieldContent>
            <FieldTitle className='h-4 w-32 rounded bg-muted'>
              &nbsp;
            </FieldTitle>
            <FieldDescription className='h-3 w-48 rounded bg-muted'>
              &nbsp;
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    ))}
  </RadioGroup>
)
