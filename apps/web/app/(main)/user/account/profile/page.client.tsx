'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'
import { Button } from '@yukinu/ui/button'
import { Field, FieldError, FieldLabel, FieldSet } from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { PencilIcon } from '@yukinu/ui/icons'
import { Input } from '@yukinu/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@yukinu/ui/input-group'
import { toast } from '@yukinu/ui/sonner'
import { Textarea } from '@yukinu/ui/textarea'
import { UserValidator } from '@yukinu/validators/user'

import { useTRPC, useTRPCClient } from '@/trpc/react'

export const ProfileAccount: React.FC = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.user.profile.queryOptions())

  return (
    <section className='px-4'>
      <h4 className='sr-only'>Account Information</h4>

      <FieldSet>
        <Field orientation='horizontal'>
          <FieldLabel className='w-28'>Username</FieldLabel>
          <InputGroup>
            <InputGroupInput value={data.username} readOnly />
            <InputGroupAddon align='inline-end'>
              <InputGroupButton>
                <PencilIcon />
                <span className='sr-only'>Edit Username</span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field orientation='horizontal'>
          <FieldLabel className='w-28'>Email</FieldLabel>
          <InputGroup>
            <InputGroupInput value={data.email} readOnly />
            <InputGroupAddon align='inline-end'>
              <InputGroupButton>
                <PencilIcon />
                <span className='sr-only'>Edit Email</span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </FieldSet>
    </section>
  )
}

export const ProfileInfo: React.FC = () => {
  const trpc = useTRPC()
  const trpcClient = useTRPCClient()
  const { data } = useSuspenseQuery(trpc.user.profile.queryOptions())

  const form = useForm({
    defaultValues: {
      avatarUrl: data.profile.avatarUrl ?? '',
      fullName: data.profile.fullName ?? '',
      bio: data.profile.bio ?? '',
      gender: data.profile.gender ?? '',
      dateOfBirth: data.profile.dateOfBirth ?? '',
      website: data.profile.website ?? '',
    },
    schema: UserValidator.updateProfileBody,
    onSubmit: trpcClient.user.updateProfile.mutate,
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
                  <FieldLabel htmlFor={meta.fieldId}>{label}</FieldLabel>
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
          <AvatarImage src={data.profile.avatarUrl ?? ''} alt={data.username} />
          <AvatarFallback>
            {data.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <Button>Change Avatar</Button>
      </div>
    </section>
  )
}

export const ProfileAccountSkeleton: React.FC = () => (
  <section className='px-4'>
    <h4 className='sr-only'>Account Information</h4>

    <form className='animate-pulse'>
      <FieldSet>
        {['Username', 'Email'].map((label) => (
          <Field key={label} orientation='horizontal'>
            <FieldLabel className='w-28'>{label}</FieldLabel>
            <Input disabled className='bg-muted/50' />
          </Field>
        ))}
      </FieldSet>
    </form>
  </section>
)

export const ProfileInfoSkeleton: React.FC = () => (
  <section className='grid gap-4 px-4 lg:grid-cols-3'>
    <h4 className='sr-only'>Profile Information</h4>

    <form className='animate-pulse lg:col-span-2'>
      <FieldSet>
        {fields.map(({ name, label, type }) => (
          <Field key={name}>
            <FieldLabel>{label}</FieldLabel>
            {type === 'textarea' ? (
              <Textarea disabled className='bg-muted/50' />
            ) : (
              <Input disabled className='bg-muted/50' />
            )}
          </Field>
        ))}

        <Field>
          <Button disabled>Save Changes</Button>
        </Field>
      </FieldSet>
    </form>

    <div className='flex flex-col items-center justify-center gap-8'>
      <div className='size-64 rounded-full bg-muted/50' />

      <Button disabled>Change Avatar</Button>
    </div>
  </section>
)

const fields = [
  { name: 'avatarUrl', label: 'Avatar URL', type: 'url' },
  { name: 'fullName', label: 'Full Name', type: 'text' },
  { name: 'gender', label: 'Gender', type: 'text' },
  { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
  { name: 'website', label: 'Website', type: 'url' },
  { name: 'bio', label: 'Bio', type: 'textarea' },
] as const
