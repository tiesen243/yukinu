'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'
import { Button } from '@yukinu/ui/button'
import { Field, FieldError, FieldLabel, FieldSet } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { Textarea } from '@yukinu/ui/textarea'
import { UserModel } from '@yukinu/validators/user'

import { useTRPC, useTRPCClient } from '@/trpc/react'

export const ProfileInfo: React.FC = () => {
  const trpc = useTRPC()
  const trpcClient = useTRPCClient()
  const { data } = useSuspenseQuery(trpc.user.getInfo.queryOptions())

  const form = useForm({
    defaultValues: {
      fullName: data.fullName ?? '',
      gender: data.gender ?? '',
      dateOfBirth: data.dateOfBirth ?? '',
      website: data.website ?? '',
      bio: data.bio ?? '',
    },
    schema: UserModel.updateProfileBody,
    onSubmit: trpcClient.user.updateInfo.mutate,
    onSuccess: () => toast.success('Profile updated successfully'),
    onError: (error) => toast.error(error.message),
  })

  return (
    <section className='grid gap-4 px-4 lg:grid-cols-3'>
      <h4 className='sr-only'>Profile Information</h4>

      <form onSubmit={form.handleSubmit} className='lg:col-span-2'>
        <FieldSet>
          {fields.map(({ name, label, type }) => (
            <form.Field
              key={name}
              name={name}
              render={({ meta, field }) => (
                <Field data-invalid={meta.errors.length > 0}>
                  <FieldLabel>{label}</FieldLabel>
                  {type === 'textarea' ? (
                    <Textarea {...field} />
                  ) : (
                    <Input {...field} type={type} />
                  )}
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </Field>
              )}
            />
          ))}

          <Field>
            <Button disabled={form.state.isPending}>Save Changes</Button>
          </Field>
        </FieldSet>
      </form>

      <div className='flex flex-col items-center justify-center gap-8'>
        <Avatar className='size-64'>
          <AvatarImage src={data.avatarUrl ?? ''} alt={data.username} />
          <AvatarFallback>{data.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>

        <Button>Change Avatar</Button>
      </div>
    </section>
  )
}

const fields = [
  { name: 'fullName', label: 'Full Name', type: 'text' },
  { name: 'gender', label: 'Gender', type: 'text' },
  { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
  { name: 'website', label: 'Website', type: 'url' },
  { name: 'bio', label: 'Bio', type: 'textarea' },
] as const
