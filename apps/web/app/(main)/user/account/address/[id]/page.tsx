import {
  FieldDescription,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@yukinu/ui/field'

import { EditAddressForm } from '@/app/(main)/user/account/address/[id]/page.client'
import { getQueryClient, trpc } from '@/trpc/rsc'

export default async function EditAddressPage({
  params,
}: PageProps<'/user/account/address/[id]'>) {
  const { id } = await params

  void getQueryClient().prefetchQuery(trpc.address.one.queryOptions({ id }))

  return (
    <form>
      <FieldSet>
        <div className='px-4'>
          <FieldLegend className='data-[variant=legend]:text-lg'>
            Edit Address
          </FieldLegend>
          <FieldDescription>
            Update your address information below.
          </FieldDescription>
        </div>

        <FieldSeparator className='-my-2' />

        <EditAddressForm id={id} />
      </FieldSet>
    </form>
  )
}
