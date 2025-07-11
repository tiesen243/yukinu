import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@yuki/ui/badge'
import { Button } from '@yuki/ui/button'
import { Card, CardContent } from '@yuki/ui/card'
import { ArrowRightIcon, CheckIcon, PlayIcon, StarIcon } from '@yuki/ui/icons'
import { Input } from '@yuki/ui/input'
import { Typography } from '@yuki/ui/typography'

import { createMetadata } from '@/lib/metadata'
import { features, navs, stats, testimonials } from './page.config'

export const metadata = createMetadata({
  title: 'Experience the Future of Shopping',
  description:
    'Welcome to our homepage, where you can find the latest updates and features.',
})

export default function HomePage() {
  return (
    <>
      <header className="bg-background/70 sticky inset-0 z-50 flex h-16 w-full items-center justify-center border-b backdrop-blur-xl backdrop-saturate-150">
        <div className="container flex items-center gap-4">
          <Link href="/" className="flex flex-1 items-center gap-2">
            <Image
              src="/assets/logo.svg"
              alt="Yukinu Logo"
              width={32}
              height={32}
              className="size-8 object-cover dark:invert"
            />
            <span className="text-xl font-semibold tracking-tight text-balance lg:text-2xl">
              Yukinu
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            {navs.map((nav) => (
              <Link
                key={nav}
                href={`#${nav.toLowerCase()}`}
                className="text-muted-foreground hover:text-primary capitalize transition-colors"
              >
                {nav}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section
          id="home"
          className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 pt-24 pb-16 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950"
        >
          <div className="container grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge variant="secondary" className="w-fit">
                  🚀 Now Available on All Platforms
                </Badge>

                <Typography variant="h1">Shop Smarter with Yukinu</Typography>

                <Typography
                  variant="p"
                  className="text-muted-foreground max-w-lg text-xl"
                >
                  Experience the future of e-commerce with our AI-powered
                  platform that learns your preferences and connects you with
                  the perfect products from trusted sellers worldwide.
                </Typography>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/">
                    Start Shopping Now
                    <ArrowRightIcon />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="group" asChild>
                  <a
                    href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PlayIcon className="transition-transform group-hover:scale-110" />
                    Watch Demo
                  </a>
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <Typography variant="h4" className="text-primary mb-0">
                      {stat.number}
                    </Typography>
                    <Typography
                      variant="caption"
                      component="p"
                      className="text-muted-foreground"
                    >
                      {stat.label}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/assets/preview.webp"
                  alt="Yukinu App Interface"
                  width={1920}
                  height={1080}
                  className="rounded-2xl shadow-2xl"
                />
              </div>

              <div className="bg-popover text-popover-foreground absolute -top-4 -right-4 z-20 rounded-lg p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <Typography
                    variant="caption"
                    component="small"
                    className="font-medium"
                  >
                    Live Orders
                  </Typography>
                </div>
                <Typography
                  variant="p"
                  className="text-muted-foreground mb-0 text-sm"
                >
                  +127 in the last hour
                </Typography>
              </div>

              <div className="bg-popover text-popover-foreground absolute -bottom-4 -left-4 z-20 rounded-lg p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <StarIcon className="h-4 w-4 fill-current text-yellow-500" />
                  <Typography
                    variant="caption"
                    component="small"
                    className="font-medium"
                  >
                    4.9/5 Rating
                  </Typography>
                </div>
                <Typography
                  variant="p"
                  className="text-muted-foreground mb-0 text-sm"
                >
                  From 50K+ reviews
                </Typography>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="container py-20">
          <div className="mb-16 text-center">
            <Typography variant="h2" className="mb-4">
              Why Choose Yukinu?
            </Typography>
            <Typography
              variant="p"
              className="text-muted-foreground mx-auto max-w-3xl"
            >
              We've reimagined e-commerce from the ground up, creating an
              intelligent platform that adapts to your needs and delivers
              exceptional shopping experiences.
            </Typography>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group border-0 shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="p-8">
                  <div className="bg-primary/10 group-hover:bg-primary/20 mb-6 flex h-16 w-16 items-center justify-center rounded-xl transition-colors">
                    <div className="text-primary">{feature.icon}</div>
                  </div>
                  <Typography variant="h5" className="mb-3">
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="p"
                    className="text-muted-foreground mb-0"
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="about" className="bg-secondary py-20">
          <div className="container grid items-center gap-16 lg:grid-cols-2">
            <div>
              <Typography variant="h2" className="mb-6">
                Built for the Modern Shopper
              </Typography>
              <Typography variant="p" className="text-muted-foreground mb-8">
                Yukinu combines cutting-edge technology with intuitive design to
                create a shopping experience that's both powerful and
                delightful. Our platform learns from your behavior to surface
                the most relevant products while ensuring your data remains
                secure.
              </Typography>

              <div className="mb-8 space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckIcon className="mt-0.5 size-6 flex-shrink-0 text-green-500" />
                  <div>
                    <Typography variant="h6" className="mb-1">
                      AI-Powered Recommendations
                    </Typography>
                    <Typography
                      variant="p"
                      className="text-muted-foreground mb-0"
                    >
                      Our machine learning algorithms analyze your preferences
                      to suggest products you'll love.
                    </Typography>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckIcon className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-500" />
                  <div>
                    <Typography variant="h6" className="mb-1">
                      Verified Seller Network
                    </Typography>
                    <Typography
                      variant="p"
                      className="text-muted-foreground mb-0"
                    >
                      Every seller is thoroughly vetted to ensure quality
                      products and reliable service.
                    </Typography>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckIcon className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-500" />
                  <div>
                    <Typography variant="h6" className="mb-1">
                      Seamless Multi-Platform Experience
                    </Typography>
                    <Typography
                      variant="p"
                      className="text-muted-foreground mb-0"
                    >
                      Start shopping on mobile, continue on desktop - your
                      experience syncs perfectly across devices.
                    </Typography>
                  </div>
                </div>
              </div>

              <Button size="lg">
                Learn More About Our Technology
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="relative">
              <Image
                src="/assets/hero-1.webp"
                alt="Yukinu Technology"
                width={1920}
                height={1080}
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </section>

        <section id="testimonials" className="container py-20">
          <div className="mb-16 text-center">
            <Typography variant="h2" className="mb-4">
              Loved by Shoppers Worldwide
            </Typography>
            <Typography
              variant="p"
              className="text-muted-foreground mx-auto max-w-2xl"
            >
              Join millions of satisfied customers who have transformed their
              shopping experience with Yukinu.
            </Typography>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <div className="mb-4 flex items-center">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <StarIcon
                        key={i}
                        className="h-5 w-5 fill-current text-yellow-400"
                      />
                    ))}
                  </div>

                  <Typography
                    variant="blockquote"
                    className="text-muted-foreground mb-6"
                  >
                    {testimonial.content}
                  </Typography>

                  <div className="flex items-center space-x-3">
                    <Image
                      src={testimonial.avatar || '/placeholder.svg'}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <Typography variant="h6" className="mb-0">
                        {testimonial.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        component="p"
                        className="text-muted-foreground"
                      >
                        {testimonial.role}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section
          id="cta"
          className="bg-gradient-to-r from-purple-600 to-blue-600 py-20 text-white dark:from-purple-900 dark:to-blue-900"
        >
          <div className="container text-center">
            <Typography variant="h2" className="mb-6 text-white">
              Ready to Transform Your Shopping?
            </Typography>
            <Typography
              variant="p"
              className="mx-auto mb-8 max-w-2xl text-xl text-purple-100"
            >
              Join over 1 million shoppers who have discovered a better way to
              find and buy the products they love.
            </Typography>

            <div className="mx-auto mb-8 flex max-w-md flex-col items-center justify-center gap-4 sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-neutral-100 text-neutral-950 dark:bg-neutral-100"
              />
              <Button
                size="lg"
                className="bg-neutral-100 whitespace-nowrap text-purple-600 hover:bg-neutral-200"
              >
                Get Started Free
              </Button>
            </div>

            <Typography
              variant="caption"
              component="p"
              className="text-purple-200"
            >
              No credit card required • Free forever plan available
            </Typography>
          </div>
        </section>
      </main>
    </>
  )
}
