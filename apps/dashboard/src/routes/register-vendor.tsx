import { SaveVendorDto } from '@yukinu/api/merchant'
import { Button } from '@yukinu/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@yukinu/ui/card'
import { Field, FieldError, FieldLabel } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { Textarea } from '@yukinu/ui/textarea'
import { toast } from '@yukinu/ui/toast'

import { UploadInput } from '@/components/upload-input'
import { env } from '@/lib/env'
import { useTRPC } from '@/lib/trpc'
import { verifyTurnstile } from '@/lib/turnstile'

import type { Route } from './+types/register-vendor'

export default function RegisterVendorPage(_: Route.ComponentProps) {
  return (
    <main className='flex h-dvh flex-col items-center justify-center px-4'>
      <Card className='min-w-full md:max-w-xl md:min-w-xl'>
        <CardHeader>
          <CardTitle>Register as a Vendor</CardTitle>
          <CardDescription>
            Fill in the form to register as a vendor and start selling your
            products on our marketplace. Provide accurate information to ensure
            a smooth registration process.
          </CardDescription>
        </CardHeader>

        <RegisterVendorForm />
      </Card>
    </main>
  )
}

const RegisterVendorForm: React.FC = () => {
  const { trpcClient } = useTRPC()
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      image: undefined,
      address: undefined,
      contact: undefined,
    } as SaveVendorDto.Input,
    schema: SaveVendorDto.input.omit({ ownerId: true }),
    onSubmit: async (data, event) => {
      await verifyTurnstile(event as unknown as React.SubmitEvent)
      return trpcClient.merchant.vendor.create.mutate(data)
    },
    onSuccess: () =>
      toast.success({
        message: 'Vendor registered successfully',
        description:
          'Your vendor registration has been submitted and is pending approval.',
      }),
    onError: (error) => toast.error({ message: error.message }),
  })

  return (
    <CardContent
      id={form.formId}
      className='flex flex-col gap-5'
      render={<form onSubmit={form.handleSubmit} />}
    >
      <form.Field
        name='name'
        render={({ field, meta }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={field.id}>Vendor Name</FieldLabel>
            <Input {...field} placeholder='Enter your vendor name' />
            <FieldError id={meta.errorId} errors={meta.errors} />
          </Field>
        )}
      />

      <form.Field
        name='description'
        render={({ field, meta }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={field.id}>Description</FieldLabel>
            <Textarea
              {...field}
              placeholder='Provide a brief description of your vendor'
            />
            <FieldError id={meta.errorId} errors={meta.errors} />
          </Field>
        )}
      />

      <form.Field
        name='image'
        render={({ field, meta }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={field.id}>Image URL</FieldLabel>
            <UploadInput
              endpoint='avatarUploader'
              value={field.value ?? ''}
              onValueChange={field.onChange}
            />
            <FieldError id={meta.errorId} errors={meta.errors} />
          </Field>
        )}
      />

      <form.Field
        name='address'
        render={({ field, meta }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={field.id}>Address</FieldLabel>
            <Input {...field} placeholder='Enter your vendor address' />
            <FieldError id={meta.errorId} errors={meta.errors} />
          </Field>
        )}
      />

      <form.Field
        name='contact'
        render={({ field, meta }) => (
          <Field data-invalid={meta.errors.length > 0}>
            <FieldLabel htmlFor={field.id}>Contact Information</FieldLabel>
            <Input {...field} placeholder='Enter your contact information' />
            <FieldError id={meta.errorId} errors={meta.errors} />
          </Field>
        )}
      />

      <Field>
        <div
          className='cf-turnstile'
          data-sitekey={env.VITE_TURNSTILE_SITE_KEY}
        />

        <Button type='submit' disabled={form.state.isPending}>
          Register
        </Button>
      </Field>
    </CardContent>
  )
}
