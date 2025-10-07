import { FieldDescription, FieldLegend, FieldSet } from '@yukinu/ui/field'

import { EditAccountForm } from '@/app/(main)/profile/@account/edit/page.client'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/rsc'

export default function EditAccountPage() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.user.profile.queryOptions())

  return (
    <HydrateClient>
      <form>
        <FieldSet>
          <FieldLegend>Edit Account Information</FieldLegend>
          <FieldDescription>
            Modify your account details and preferences here.
          </FieldDescription>

          <EditAccountForm />
        </FieldSet>
      </form>
    </HydrateClient>
  )
}
