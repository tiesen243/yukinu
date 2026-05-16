'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { ProfileEntity, UpdateProfileDto } from '@yukinu/api/identity'
import { Avatar, AvatarImage, AvatarFallback } from '@yukinu/ui/avatar'
import { Button } from '@yukinu/ui/button'
import {
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldGroup,
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { UserIcon } from '@yukinu/ui/icons'
import { Input } from '@yukinu/ui/input'
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
  InputGroupText,
} from '@yukinu/ui/input-group'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@yukinu/ui/select'
import { Textarea } from '@yukinu/ui/textarea'
import { toast } from '@yukinu/ui/toast'

import { UploadInput } from '@/components/upload-input'
import { useTRPC } from '@/lib/trpc'

export function UpdateProfileForm() {
  const { trpc } = useTRPC()
  const { data } = useQuery(trpc.identity.user.profile.queryOptions({}))
  const { mutateAsync } = useMutation({
    ...trpc.identity.user.updateProfile.mutationOptions(),
    meta: { filter: trpc.identity.user.profile.queryFilter() },
    onSuccess: () => toast.success({ message: 'Profile updated successfully' }),
    onError: ({ message }) => toast.error({ message }),
  })

  const form = useForm({
    defaultValues: {
      fullName: data?.profile.fullName,
      bio: data?.profile.bio,
      gender: data?.profile.gender,
      dateOfBirth: data?.profile.dateOfBirth,
      image: data?.user.image,
      banner: data?.profile.banner,
    } as UpdateProfileDto.Input,
    schema: UpdateProfileDto.input.omit({ id: true }),
    onSubmit: mutateAsync,
  })

  return (
    <form id={form.formId} onSubmit={form.handleSubmit}>
      <h3 className='sr-only'>Update Profile form</h3>

      <FieldSet>
        <FieldLegend>Update your personal information below</FieldLegend>
        <FieldDescription>
          Make sure to keep your profile information up to date.
        </FieldDescription>

        <FieldGroup>
          <form.Field
            name='image'
            render={({ meta, field: { value, ...field } }) => (
              <Field
                orientation='responsive'
                data-invalid={meta.errors.length > 0}
              >
                <FieldContent>
                  <FieldLabel htmlFor={field.id}>Profile Image URL</FieldLabel>
                  <InputGroup>
                    <UploadInput
                      endpoint='avatarUploader'
                      value={value ?? ''}
                      onValueChange={field.onChange}
                    >
                      <InputGroupAddon align='inline-end'>
                        <InputGroupButton
                          onClick={async () => {
                            const buffer = new TextEncoder().encode(
                              data?.user.email.trim().toLowerCase(),
                            )
                            const hashBuffer = await crypto.subtle.digest(
                              'SHA-256',
                              buffer,
                            )
                            const hashedEmail = [...new Uint8Array(hashBuffer)]
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
                    </UploadInput>
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
              >
                <FieldContent>
                  <FieldLabel htmlFor={field.id}>Banner Image URL</FieldLabel>
                  <UploadInput
                    endpoint='bannerUploader'
                    value={value ?? ''}
                    onValueChange={field.onChange}
                  />
                  <FieldError id={meta.errorId} errors={meta.errors} />
                </FieldContent>

                <Avatar className='size-full after:border-none @md/field-group:size-40'>
                  <AvatarImage
                    src={value ?? ''}
                    alt='Banner Image'
                    className='aspect-video rounded-md'
                  />
                  <AvatarFallback className='aspect-video rounded-md bg-muted' />
                </Avatar>
              </Field>
            )}
          />

          <form.Field
            name='fullName'
            render={({ meta, field: { value, ...field } }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Full Name</FieldLabel>
                <Input
                  {...field}
                  value={value ?? ''}
                  placeholder='Enter your full name'
                />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='bio'
            render={({ meta, field: { value, ...field } }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Bio</FieldLabel>
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
                <FieldLabel htmlFor={field.id}>Gender</FieldLabel>
                <Select
                  {...field}
                  onValueChange={onChange}
                  items={[
                    ...ProfileEntity.genders.map((gender) => ({
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
                      {ProfileEntity.genders.map((gender) => (
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
                <FieldLabel htmlFor={field.id}>Date of Birth</FieldLabel>
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
