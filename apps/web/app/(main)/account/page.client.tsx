'use client'

import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'
import { Button } from '@yukinu/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@yukinu/ui/dialog'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { PencilIcon, UserIcon } from '@yukinu/ui/icons'
import { Input } from '@yukinu/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@yukinu/ui/input-group'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from '@yukinu/ui/select'
import { toast } from '@yukinu/ui/sonner'
import { Textarea } from '@yukinu/ui/textarea'
import { changeUsernameInput } from '@yukinu/validators/auth'
import { genders, updateProfileInput } from '@yukinu/validators/user'
import { useState } from 'react'

import { InputGroupUploadButton } from '@/components/input-group-upload-button'
import { useTRPC } from '@/lib/trpc/react'

export const ProfileSummary: React.FC = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.user.profile.queryOptions({}))

  return (
    <section className='flex flex-col gap-7'>
      <h3 className='sr-only'>Profile Summary section</h3>

      <FieldSet>
        <FieldLegend>Account Overview</FieldLegend>
        <FieldDescription>
          Here are your current account details. You can update your profile
          information whenever you need.
        </FieldDescription>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor='username'>Username</FieldLabel>
            <InputGroup>
              <InputGroupInput id='username' value={data.username} readOnly />
              <InputGroupAddon
                align='inline-end'
                onClick={(e) => e.stopPropagation()}
              >
                <ChangeUsernameForm username={data.username} />
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel>Email Address</FieldLabel>
            <InputGroup>
              <InputGroupInput value={data.email} readOnly />
              <InputGroupAddon align='inline-end'>
                <InputGroupText>
                  {data.emailVerified ? 'Verified' : 'Unverified'}
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </FieldSet>
    </section>
  )
}

export const ProfileSummarySkeleton: React.FC = () => (
  <section className='flex flex-col gap-7'>
    <h3 className='sr-only'>Profile Summary section</h3>

    <FieldSet className='animate-pulse'>
      <FieldLegend>Account Overview</FieldLegend>
      <FieldDescription>
        Here are your current account details. You can update your profile
        information whenever you need.
      </FieldDescription>

      <FieldGroup>
        <Field>
          <FieldLabel>Username</FieldLabel>
          <InputGroup>
            <InputGroupInput readOnly />
            <InputGroupAddon align='inline-end'>
              <InputGroupText>Loading...</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <Field>
          <FieldLabel>Email Address</FieldLabel>
          <InputGroup>
            <InputGroupInput readOnly />
            <InputGroupAddon align='inline-end'>
              <InputGroupText>Loading...</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </FieldGroup>
    </FieldSet>
  </section>
)

export function UpdateProfileForm() {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.user.profile.queryOptions({}))
  const { mutateAsync } = useMutation({
    ...trpc.user.updateProfile.mutationOptions(),
    meta: { filter: trpc.user.profile.queryFilter() },
    onSuccess: () => toast.success('Profile updated successfully'),
    onError: ({ message }) =>
      toast.error('Failed to update profile', { description: message }),
  })

  const form = useForm({
    defaultValues: {
      fullName: data.profile.fullName,
      bio: data.profile.bio,
      gender: data.profile.gender,
      dateOfBirth: data.profile.dateOfBirth,
      avatar: data.image,
      banner: data.profile.banner,
    },
    schema: updateProfileInput.omit({ id: true }),
    onSubmit: mutateAsync,
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <h3 className='sr-only'>Update Profile form</h3>

      <FieldSet>
        <FieldLegend>Update your personal information below</FieldLegend>
        <FieldDescription>
          Make sure to keep your profile information up to date.
        </FieldDescription>

        <FieldGroup>
          <form.Field
            name='avatar'
            render={({ meta, field: { value, ...field } }) => (
              <Field
                orientation='responsive'
                data-invalid={meta.errors.length > 0}
                className='gap-4'
              >
                <FieldContent>
                  <FieldLabel htmlFor={meta.fieldId}>
                    Profile Image URL
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...field} value={value ?? ''} />
                    <InputGroupAddon align='inline-end'>
                      <InputGroupUploadButton
                        endpoint='avatarUploader'
                        onUploadComplete={(url) => field.onChange(url)}
                      />
                    </InputGroupAddon>
                    <InputGroupAddon align='inline-end'>
                      <InputGroupButton
                        onClick={async () => {
                          const buffer = new TextEncoder().encode(
                            data.email.trim().toLowerCase(),
                          )
                          const hashBuffer = await crypto.subtle.digest(
                            'SHA-256',
                            buffer,
                          )
                          const hashedEmail = Array.from(
                            new Uint8Array(hashBuffer),
                          )
                            .map((b) => b.toString(16).padStart(2, '0'))
                            .join('')
                          return field.onChange(
                            `https://1.gravatar.com/avatar/${hashedEmail}?s=512&d=identicon`,
                          )
                        }}
                      >
                        Using Gravatar
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </FieldContent>

                <div className='flex justify-center'>
                  <Avatar className='size-20'>
                    <AvatarImage src={value ?? ''} alt='Profile Image' />
                    <AvatarFallback>
                      <UserIcon className='size-10 text-muted-foreground' />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </Field>
            )}
          />

          <form.Field
            name='banner'
            render={({ meta, field: { value, ...field } }) => (
              <Field
                orientation='responsive'
                data-invalid={meta.errors.length > 0}
                className='gap-4'
              >
                <FieldContent>
                  <FieldLabel htmlFor={meta.fieldId}>
                    Banner Image URL
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...field} value={value ?? ''} />
                    <InputGroupAddon align='inline-end'>
                      <InputGroupUploadButton
                        endpoint='bannerUploader'
                        onUploadComplete={(url) => field.onChange(url)}
                      />
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </FieldContent>

                <Avatar className='size-full @md/field-group:size-40 after:border-none'>
                  <AvatarImage
                    src={value ?? ''}
                    alt='Banner Image'
                    className='rounded-md aspect-video'
                  />
                  <AvatarFallback className='bg-muted rounded-md aspect-video' />
                </Avatar>
              </Field>
            )}
          />

          <form.Field
            name='fullName'
            render={({ meta, field: { value, ...field } }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={meta.fieldId}>Full Name</FieldLabel>
                <Input {...field} value={value ?? ''} />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='bio'
            render={({ meta, field: { value, ...field } }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={meta.fieldId}>Bio</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    value={value ?? ''}
                    placeholder='Tell us about yourself...'
                  />
                  <InputGroupAddon align='block-end'>
                    <InputGroupText
                      className={`ml-auto ${value && value.length > 2000 ? 'text-destructive' : ''}`}
                    >
                      {value?.length ?? 0}/2000
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='gender'
            render={({ meta, field: { onChange, ...field } }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={meta.fieldId}>Gender</FieldLabel>
                <Select
                  {...field}
                  onValueChange={onChange}
                  items={[
                    ...genders.map((gender) => ({
                      label: gender,
                      value: gender,
                    })),
                    { label: 'Select gender', value: null },
                  ]}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {genders.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='dateOfBirth'
            render={({ meta, field: { value, ...field } }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={meta.fieldId}>Date of Birth</FieldLabel>
                <Input type='date' {...field} value={value ?? ''} />
                <FieldError id={meta.errorId} errors={meta.errors} />
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

export const UpdateProfileFormSkeleton: React.FC = () => (
  <div className='animate-pulse'>
    <h3 className='sr-only'>Update Profile form</h3>

    <FieldSet>
      <FieldLegend>Update your personal information below</FieldLegend>
      <FieldDescription>
        Make sure to keep your profile information up to date.
      </FieldDescription>

      <FieldGroup>
        <Field orientation='horizontal' className='gap-4'>
          <FieldContent>
            <FieldLabel>Profile Image URL</FieldLabel>
            <InputGroup>
              <InputGroupInput readOnly />
              <InputGroupAddon align='inline-end'>
                <InputGroupText>Loading...</InputGroupText>
              </InputGroupAddon>
              <InputGroupAddon align='inline-end'>
                <InputGroupText>Loading...</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </FieldContent>

          <div className='size-20 rounded-full bg-muted' />
        </Field>

        <Field>
          <FieldLabel>Full Name</FieldLabel>
          <Input readOnly />
        </Field>

        <Field>
          <FieldLabel>Bio</FieldLabel>
          <Textarea readOnly />
        </Field>

        <Field>
          <FieldLabel>Gender</FieldLabel>
          <Input readOnly />
        </Field>

        <Field>
          <FieldLabel>Date of Birth</FieldLabel>
          <Input readOnly />
        </Field>

        <Field>
          <Button disabled>Save Changes</Button>
        </Field>
      </FieldGroup>
    </FieldSet>
  </div>
)

const ChangeUsernameForm: React.FC<{ username: string }> = ({ username }) => {
  const [open, setOpen] = useState(false)

  const trpc = useTRPC()
  const { mutateAsync } = useMutation({
    ...trpc.security.changeUsername.mutationOptions(),
    meta: { filter: trpc.user.profile.queryFilter() },
    onSuccess: () => toast.success('Username changed successfully'),
    onError: ({ message }) =>
      toast.error('Failed to change username', { description: message }),
  })

  const form = useForm({
    defaultValues: { username, password: '' },
    schema: changeUsernameInput.omit({ id: true }),
    onSubmit: mutateAsync,
    onSuccess: () => {
      setOpen(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        variant='ghost'
        render={
          <InputGroupButton>
            <PencilIcon />
          </InputGroupButton>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Username</DialogTitle>
          <DialogDescription>
            Enter your new username and password to confirm the change.
          </DialogDescription>
        </DialogHeader>

        <form id='change-username-form' onSubmit={form.handleSubmit}>
          <FieldSet>
            <FieldGroup>
              <form.Field
                name='username'
                render={({ meta, field }) => (
                  <Field data-invalid={meta.errors.length > 0}>
                    <FieldLabel htmlFor={meta.fieldId}>New Username</FieldLabel>
                    <Input {...field} />
                    <FieldError id={meta.errorId} errors={meta.errors} />
                  </Field>
                )}
              />

              <form.Field
                name='password'
                render={({ meta, field }) => (
                  <Field data-invalid={meta.errors.length > 0}>
                    <FieldLabel htmlFor={meta.fieldId}>Password</FieldLabel>
                    <Input type='password' {...field} />
                    <FieldError id={meta.errorId} errors={meta.errors} />
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
        </form>

        <DialogFooter>
          <DialogClose
            render={
              <Button variant='outline' disabled={form.state.isPending}>
                Cancel
              </Button>
            }
          />

          <Button
            type='submit'
            form='change-username-form'
            disabled={form.state.isPending}
          >
            {form.state.isPending ? 'Changing...' : 'Change Username'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
