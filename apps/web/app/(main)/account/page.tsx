import { AccountHeader } from '@/app/(main)/account/_components/header'
import { ProfileSummary } from '@/app/(main)/account/_components/profile-summary'
import { UpdateProfileForm } from '@/app/(main)/account/_components/update-profile-form'

export default function AccountPage() {
  return (
    <>
      <AccountHeader
        title='My Profile'
        description='View and update your personal details, email, and password to keep your account secure.'
      />

      <section className='flex flex-col gap-4 px-4'>
        <h2 className='sr-only'>Profile Information section</h2>

        <ProfileSummary />

        <hr className='my-4' />

        <UpdateProfileForm />
      </section>
    </>
  )
}
