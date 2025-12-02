import { Suspense } from 'react'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

import { Button } from '@yukinu/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Loader2Icon } from '@yukinu/ui/icons'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { Textarea } from '@yukinu/ui/textarea'
import { VendorValidators } from '@yukinu/validators/vendor'

import type { Route } from './+types/_index'
import { useTRPC } from '@/lib/trpc/react'
import { createTRPC, getQueryClient } from '@/lib/trpc/rsc'

export const loader = ({ request }: Route.LoaderArgs) => {
  const trpc = createTRPC(request)
  void getQueryClient().prefetchQuery(trpc.vendor.me.queryOptions())
}

export default function MyStorePage(_: Route.ComponentProps) {
  return (
    <Suspense
      fallback={
        <div className='grid h-[568px] w-full place-items-center rounded-lg bg-card text-card-foreground shadow-sm'>
          <Loader2Icon className='animate-spin' />
        </div>
      }
    >
      <MyStoreForm />
    </Suspense>
  )
}

const MyStoreForm: React.FC = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery({
    ...trpc.vendor.me.queryOptions(),
  })
  const { mutateAsync } = useMutation({
    ...trpc.vendor.update.mutationOptions(),
    meta: { filter: trpc.vendor.me.queryFilter() },
  })

  const form = useForm({
    defaultValues: {
      name: data.name,
      description: data.description,
      image: data.image,
      address: data.address,
    } as Omit<VendorValidators.UpdateInput, 'id'>,
    schema: VendorValidators.updateInput.omit({ id: true }),
    onSubmit: mutateAsync,
    onSuccess: () => toast.success('Store updated successfully!'),
    onError: ({ message }) => toast.error(message),
  })

  return (
    <form
      onSubmit={form.handleSubmit}
      className='rounded-lg bg-card p-6 text-card-foreground shadow-sm'
    >
      <FieldSet>
        <FieldLegend>My Store</FieldLegend>
        <FieldDescription>
          Update your store details and preferences below.
        </FieldDescription>

        <FieldGroup>
          <form.Field
            name='name'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={meta.fieldId}>Store Name</FieldLabel>
                <Input {...field} />
              </Field>
            )}
          />

          <form.Field
            name='description'
            render={({ meta, field: { value, ...field } }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={meta.fieldId}>Description</FieldLabel>
                <Textarea {...field} value={value ?? ''} />
              </Field>
            )}
          />

          <form.Field
            name='image'
            render={({ meta, field: { value, ...field } }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={meta.fieldId}>Image URL</FieldLabel>
                <Input {...field} value={value ?? ''} />
              </Field>
            )}
          />

          <form.Field
            name='address'
            render={({ meta, field: { value, ...field } }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={meta.fieldId}>Address</FieldLabel>
                <Input {...field} value={value ?? ''} />
              </Field>
            )}
          />

          <Field>
            <Button type='submit' disabled={form.state.isPending}>
              {form.state.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
