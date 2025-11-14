import {
  FieldDescription,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@yukinu/ui/field'

import { NewAddressForm } from '@/app/(main)/user/account/address/new/page.client'

export default function NewAddressPage() {
  return (
    <form>
      <FieldSet>
        <div className='px-4'>
          <FieldLegend className='data-[variant=legend]:text-lg'>
            Add New Address
          </FieldLegend>
          <FieldDescription>
            Please fill in the form below to add a new address to your account.
          </FieldDescription>
        </div>

        <FieldSeparator className='-my-2' />

        <NewAddressForm />
      </FieldSet>
    </form>
  )
}
