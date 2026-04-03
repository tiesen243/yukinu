import Head from 'next/head'

import AuthLayoutClient from '@/app/(auth)/layout.client'

export default function AuthLayout({ children, params }: LayoutProps<'/'>) {
  return (
    <>
      <Head>
        <link rel='preconnect' href='https://challenges.cloudflare.com' />
      </Head>

      <AuthLayoutClient params={params}>{children}</AuthLayoutClient>
    </>
  )
}
