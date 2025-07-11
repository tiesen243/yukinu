import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Cookie Policy',
  description:
    'Learn about our cookie policy and how we use cookies on our website.',
})

export default function CookiePage() {
  return (
    <main className="container py-12 md:py-24">
      <h1 className="mb-8 text-4xl font-bold">Cookie Policy</h1>
      <div className="prose prose-lg max-w-none">
        <p>
          This is the Cookie Policy for Yukinu, accessible from
          https://yukinu.vercel.app
        </p>

        <h2 className="mt-8 text-2xl font-bold">What Are Cookies</h2>
        <p>
          As is common practice with almost all professional websites this site
          uses cookies, which are tiny files that are downloaded to your
          computer, to improve your experience. This page describes what
          information they gather, how we use it and why we sometimes need to
          store these cookies. We will also share how you can prevent these
          cookies from being stored however this may downgrade or
          &apos;break&apos; certain elements of the sites functionality.
        </p>

        <h2 className="mt-8 text-2xl font-bold">How We Use Cookies</h2>
        <p>
          We use cookies for a variety of reasons detailed below. Unfortunately
          in most cases there are no industry standard options for disabling
          cookies without completely disabling the functionality and features
          they add to this site. It is recommended that you leave on all cookies
          if you are not sure whether you need them or not in case they are used
          to provide a service that you use.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Disabling Cookies</h2>
        <p>
          You can prevent the setting of cookies by adjusting the settings on
          your browser (see your browser Help for how to do this). Be aware that
          disabling cookies will affect the functionality of this and many other
          websites that you visit. Disabling cookies will usually result in also
          disabling certain functionality and features of the this site.
          Therefore it is recommended that you do not disable cookies.
        </p>
      </div>
    </main>
  )
}
