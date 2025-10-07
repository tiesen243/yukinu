'use client'

import Image from 'next/image'
import { useSuspenseQuery } from '@tanstack/react-query'

import { Button } from '@yukinu/ui/button'
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxTrigger,
} from '@yukinu/ui/combobox'
import { Field, FieldError, FieldGroup, FieldLabel } from '@yukinu/ui/field'
import { FormField, useForm } from '@yukinu/ui/form'
import { Input } from '@yukinu/ui/input'
import { toast } from '@yukinu/ui/sonner'
import { Textarea } from '@yukinu/ui/textarea'

import { useTRPC } from '@/trpc/react'

export const EditAccountForm: React.FC = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.user.profile.queryOptions())

  const form = useForm({
    defaultValues: {
      avatarUrl: data.avatarUrl ?? '',
      fullName: data.fullName ?? '',
      dateOfBirth: data.dateOfBirth ?? '',
      gender: data.gender ?? '',
      website: data.website ?? '',
      bio: data.bio ?? '',
    },
    onSubmit: (values) => {
      toast.success('Profile updated successfully!', {
        description: (
          <pre className='max-w-[300px] overflow-x-auto rounded-md bg-background'>
            {JSON.stringify(values, null, 2)}
          </pre>
        ),
      })
    },
  })

  return (
    <FieldGroup>
      <FieldGroup className='grid sm:grid-cols-2'>
        <FormField
          control={form.control}
          name='avatarUrl'
          render={({ meta, field, state }) => (
            <Field data-invalid={state.hasError}>
              <FieldLabel htmlFor={meta.fieldId}>Avatar URL</FieldLabel>
              <Input
                {...field}
                type='url'
                placeholder='https://example.com/avatar.jpg'
              />
              <FieldError errors={state.errors} />
            </Field>
          )}
        />

        <Image
          src={form.state.values.avatarUrl}
          alt='avatar-preview'
          width={80}
          height={80}
          className='mx-auto'
        />
      </FieldGroup>

      <FieldGroup className='grid sm:grid-cols-2'>
        <FormField
          control={form.control}
          name='fullName'
          render={({ meta, field, state }) => (
            <Field data-invalid={state.hasError}>
              <FieldLabel htmlFor={meta.fieldId}>Full Name</FieldLabel>
              <Input {...field} placeholder='Enter your full name' />
              <FieldError errors={state.errors} />
            </Field>
          )}
        />

        <FormField
          control={form.control}
          name='dateOfBirth'
          render={({ meta, field, state }) => (
            <Field data-invalid={state.hasError}>
              <FieldLabel htmlFor={meta.fieldId}>Date of Birth</FieldLabel>
              <Input {...field} type='date' placeholder='YYYY-MM-DD' />
              <FieldError errors={state.errors} />
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup className='grid sm:grid-cols-2'>
        <FormField
          control={form.control}
          name='gender'
          render={({ meta, field, state }) => (
            <Field data-invalid={state.hasError}>
              <FieldLabel htmlFor={meta.fieldId}>Gender</FieldLabel>
              <Combobox value={field.value} onValueChange={field.onChange}>
                <ComboboxTrigger
                  id={meta.fieldId}
                  placeholder='Select your gender'
                  className='capitalize'
                />
                <ComboboxContent>
                  {genders.map((gender) => (
                    <ComboboxItem
                      key={gender}
                      value={gender}
                      className='capitalize'
                    >
                      {gender}
                    </ComboboxItem>
                  ))}
                </ComboboxContent>
              </Combobox>
            </Field>
          )}
        />

        <FormField
          control={form.control}
          name='website'
          render={({ meta, field, state }) => (
            <Field data-invalid={state.hasError}>
              <FieldLabel htmlFor={meta.fieldId}>Website</FieldLabel>
              <Input {...field} type='url' placeholder='https://example.com' />
              <FieldError errors={state.errors} />
            </Field>
          )}
        />
      </FieldGroup>

      <FormField
        control={form.control}
        name='bio'
        render={({ meta, field, state }) => (
          <Field data-invalid={state.hasError}>
            <FieldLabel htmlFor={meta.fieldId}>Bio</FieldLabel>
            <Textarea {...field} placeholder='Tell us about yourself' />
            <FieldError errors={state.errors} />
          </Field>
        )}
      />

      <Button
        type='submit'
        onClick={form.handleSubmit}
        disabled={form.state.isPending}
      >
        {form.state.isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </FieldGroup>
  )
}

const genders = [
  'male',
  'female',
  'heterosexual',
  'homosexual',
  'gay',
  'lesbian',
  'bisexual',
  'femboy',
  'tomboy',
  'variant',
  'pansexual',
  'omnisexual',
  'polysexual',
  'monosexual',
  'asexual',
  'demisexual',
  'graysexual',
  'lithsexual',
  'autosexual',
  'requisexual',
  'reciprosexual',
  'abrosexual',
  'acespike',
  'allossexual',
  'objectumsexual',
  'pomosexual',
  'quoisexual',
  'sapiosexual',
  'androsexual',
  'gynesexual',
  'skoliosexual',
  'spectrasexual',
  'multisexual',
  'varisexual',
  'helicoptersexual',
  'blendedsexual',
  'ambisexual',
  'polygamoussexual',
  'transgendersexual',
  'intergendersexual',
  'ceterosexual',
  'censexual',
  'cupiosexual',
  'fraysexual',
  'bellussexual',
  'novosexual',
  'placiosexual',
  'egoosexual',
  'apothisexual',
  'idemsexual',
  'neutralsexual',
  'dionsexual',
  'mirralsexual',
  'fluidsexual',
  'grayromantic',
  'biromantic',
  'panromantic',
  'aromantic',
  'demiromantic',
  'quoiromantic',
  'recipromantic',
  'lithromantic',
  'frayromantic',
  'cupioromantic',
  'apothiromantic',
  'polyromantic',
  'omniromantic',
  'multiromantic',
  'ambiroamantic',
  'transromantic',
]
