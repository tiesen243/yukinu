'use client'

import { useRouter } from 'next/navigation'

import type { RouterOutputs } from '@yuki/api'
import { Alert, AlertDescription, AlertTitle } from '@yuki/ui/alert'
import { Button } from '@yuki/ui/button'
import { useForm } from '@yuki/ui/form'
import { Input } from '@yuki/ui/input'
import { toast } from '@yuki/ui/sonner'
import { updateAddressSchema } from '@yuki/validators/address'

import { useTRPC } from '@/trpc/react'

export const CreateOrEditAddressForm: React.FC<{
  id: string
  defaultValues: Omit<RouterOutputs['address']['byId'], 'userId'>
}> = ({ id, defaultValues }) => {
  const { trpc, trpcClient, queryClient } = useTRPC()
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      id,
    },
    validator: updateAddressSchema,
    onSubmit:
      id === 'new'
        ? trpcClient.address.add.mutate
        : trpcClient.address.update.mutate,
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.address.all.queryFilter())
      router.back()
      toast.success(
        id === 'new'
          ? 'Address created successfully!'
          : 'Address updated successfully!',
      )
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <form
      className='grid w-full gap-4'
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <Alert variant='destructive'>
        <AlertTitle>Development Notice</AlertTitle>
        <AlertDescription>
          This is just a personal project. Please don't add your actual address
          information here.
        </AlertDescription>
      </Alert>

      <form.Field
        name='name'
        render={({ field, meta }) => (
          <div id={meta.id} className='grid gap-2'>
            <form.Label>Name</form.Label>
            <form.Control {...field}>
              <Input placeholder='Pepe' />
            </form.Control>
            <form.Message />
          </div>
        )}
      />

      <form.Field
        name='phone'
        render={({ field, meta }) => (
          <div id={meta.id} className='grid gap-2'>
            <form.Label>Phone</form.Label>
            <form.Control {...field}>
              <Input placeholder='(+123) 456 789 012' />
            </form.Control>
            <form.Message />
          </div>
        )}
      />

      <form.Field
        name='line1'
        render={({ field, meta }) => (
          <div id={meta.id} className='grid gap-2'>
            <form.Label>Address Line 1</form.Label>
            <form.Control {...field}>
              <Input placeholder='123 Main St' />
            </form.Control>
            <form.Message />
          </div>
        )}
      />

      <form.Field
        name='line2'
        render={({ field, meta }) => (
          <div id={meta.id} className='grid gap-2'>
            <form.Label>Address Line 2</form.Label>
            <form.Control {...field} value={field.value ?? ''}>
              <Input placeholder='Apt 4B' />
            </form.Control>
            <form.Message />
          </div>
        )}
      />

      <form.Field
        name='city'
        render={({ field, meta }) => (
          <div id={meta.id} className='grid gap-2'>
            <form.Label>City</form.Label>
            <form.Control {...field}>
              <Input placeholder='Springfield' />
            </form.Control>
            <form.Message />
          </div>
        )}
      />

      <form.Field
        name='state'
        render={({ field, meta }) => (
          <div id={meta.id} className='grid gap-2'>
            <form.Label>State</form.Label>
            <form.Control {...field}>
              <Input placeholder='IL' />
            </form.Control>
            <form.Message />
          </div>
        )}
      />

      <form.Field
        name='country'
        render={({ field, meta }) => (
          <div id={meta.id} className='grid gap-2'>
            <form.Label>Country</form.Label>
            <form.Control {...field}>
              <Input placeholder='USA' />
            </form.Control>
            <form.Message />
          </div>
        )}
      />

      <form.Field
        name='postalCode'
        render={({ field, meta }) => (
          <div id={meta.id} className='grid gap-2'>
            <form.Label>Posttal Code</form.Label>
            <form.Control {...field}>
              <Input placeholder='62704' />
            </form.Control>
            <form.Message />
          </div>
        )}
      />

      <Button disabled={form.state.isPending}>
        {id === 'new' ? 'Create Address' : 'Update Address'}
      </Button>
    </form>
  )
}
