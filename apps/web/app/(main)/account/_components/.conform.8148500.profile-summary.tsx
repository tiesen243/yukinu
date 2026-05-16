'use client'

import { useQuery } from '@tanstack/react-query'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@yukinu/ui/field'
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupText,
} from '@yukinu/ui/input-group'

import { ChangeUsernameForm } from '@/app/(main)/account/_components/change-username-form'
import { useTRPC } from '@/lib/trpc'

export const ProfileSummary: React.FC = () => {
  const { trpc } = useTRPC()
  const { data, status } = useQuery(trpc.identity.user.profile.queryOptions({}))

  if (status !== 'success') return <ProfileSummarySkeleton />

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
              <InputGroupInput
                id='username'
                value={data.user.username}
                readOnly
              />
              <InputGroupAddon
                align='inline-end'
                onClick={(e) => e.stopPropagation()}
              >
                <ChangeUsernameForm username={data.user.username} />
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel>Email Address</FieldLabel>
            <InputGroup>
              <InputGroupInput value={data.user.email} readOnly />
              <InputGroupAddon align='inline-end'>
                <InputGroupText>
                  {data.user.emailVerified ? 'Verified' : 'Unverified'}
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
