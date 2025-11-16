import { Button } from '@yukinu/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { Textarea } from '@yukinu/ui/textarea'
import { VendorModels } from '@yukinu/validators/vendor'

import { createMetadata } from '@/lib/metadata'
import { useTRPCClient } from '@/trpc/react'

export default function DashboardVendorsRegister() {
  return (
    <main className='container py-4'>
      <RegisterShopForm />
    </main>
  )
}

export const meta = () =>
  createMetadata({
    title: 'Register Your Shop',
    description: 'Register your shop to start selling your products.',
  })

function RegisterShopForm() {
  const trpc = useTRPCClient()

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      website: null,
    } as Omit<VendorModels.RegisterInput, 'userId'>,
    schema: VendorModels.registerInput.omit({ userId: true }),
    onSubmit: trpc.vendor.register.mutate,
    onError: ({ message }) => toast.error(message),
    onSuccess: () =>
      toast.success('Shop registered successfully!', {
        description:
          'Your shop is under review. You will be notified once it is approved.',
      }),
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <FieldSet>
        <FieldLegend>Register Your Shop</FieldLegend>
        <FieldDescription>
          Register your shop to start selling your products on our platform.
          After registration, your shop will be reviewed and you will need to
          wait for approval before you can start selling.
        </FieldDescription>

        <FieldGroup>
          <form.Field
            name='name'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={meta.fieldId}>Shop Name</FieldLabel>
                <Input {...field} placeholder='Enter your shop name' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='description'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={meta.fieldId}>Shop Description</FieldLabel>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  placeholder='Enter a brief description of your shop'
                />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='website'
            render={({ meta, field }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={meta.fieldId}>Shop Website</FieldLabel>
                <Input
                  {...field}
                  type='url'
                  value={field.value ?? ''}
                  placeholder='Enter your shop website URL'
                />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <Field>
            <Button type='submit' disabled={form.state.isPending}>
              {form.state.isPending ? 'Registering...' : 'Register Shop'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
