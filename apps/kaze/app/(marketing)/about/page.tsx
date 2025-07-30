import Image from 'next/image'

import { Badge } from '@yuki/ui/badge'
import { Button } from '@yuki/ui/button'
import { Card, CardContent } from '@yuki/ui/card'
import {
  ArrowRightIcon,
  AwardIcon,
  CalendarIcon,
  MailIcon,
  MapPinIcon,
  ShieldIcon,
  TargetIcon,
  TrendingUpIcon,
  UsersIcon,
} from '@yuki/ui/icons'
import { Typography } from '@yuki/ui/typography'

import {
  stats,
  team,
  timeline,
  values,
} from '@/app/(marketing)/about/page.config'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'About Us',
  description: 'Learn more about our company, mission, and values.',
})

export default function AboutPage() {
  return (
    <main>
      <section className='bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-20 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950'>
        <div className='container text-center'>
          <Badge variant='secondary' className='mb-6'>
            🚀 Our Story
          </Badge>

          <Typography variant='h1' className='mb-6'>
            Building the Future of Commerce
          </Typography>

          <Typography className='mx-auto mb-8 max-w-3xl text-xl text-muted-foreground'>
            We're on a mission to revolutionize how people discover, evaluate,
            and purchase products online. Through intelligent technology and
            human-centered design, we're creating shopping experiences that feel
            magical.
          </Typography>

          <div className='mt-12 grid gap-8 md:grid-cols-4'>
            {stats.map((stat) => (
              <div key={stat.label} className='text-center'>
                <div className='mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-card text-card-foreground shadow-sm'>
                  {stat.icon}
                </div>
                <Typography variant='h4' className='mb-1'>
                  {stat.number}
                </Typography>
                <Typography
                  variant='caption'
                  component='p'
                  className='text-muted-foreground'
                >
                  {stat.label}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='container grid items-center gap-16 py-20 lg:grid-cols-2'>
        <div>
          <Typography variant='h2' className='mb-6'>
            Our Mission
          </Typography>
          <Typography variant='p' className='mb-6 text-muted-foreground'>
            We believe shopping should be intuitive, personalized, and
            delightful. Our mission is to eliminate the friction between wanting
            something and finding it, using artificial intelligence to
            understand what you need before you even know it yourself.
          </Typography>
          <Typography variant='p' className='mb-8 text-muted-foreground'>
            Every day, millions of people waste time searching through
            irrelevant products, comparing prices across multiple sites, and
            worrying about whether they can trust a seller. We're changing that
            by creating a platform that learns, adapts, and serves.
          </Typography>

          <div className='space-y-4'>
            <div className='flex items-start space-x-3'>
              <div className='mt-1 rounded-full bg-primary/10 p-2'>
                <TargetIcon className='h-4 w-4 text-primary' />
              </div>
              <div>
                <Typography variant='h6' className='mb-1'>
                  Personalized Discovery
                </Typography>
                <Typography variant='p' className='mb-0 text-muted-foreground'>
                  AI that understands your style, needs, and budget to surface
                  the perfect products.
                </Typography>
              </div>
            </div>

            <div className='flex items-start space-x-3'>
              <div className='mt-1 rounded-full bg-primary/10 p-2'>
                <ShieldIcon className='h-4 w-4 text-primary' />
              </div>
              <div>
                <Typography variant='h6' className='mb-1'>
                  Trust & Transparency
                </Typography>
                <Typography variant='p' className='mb-0 text-muted-foreground'>
                  Verified sellers, authentic reviews, and clear pricing with no
                  hidden fees.
                </Typography>
              </div>
            </div>
          </div>
        </div>

        <div className='relative'>
          <Image
            src='/assets/images/hero-1.webp'
            alt='Our Mission'
            width={600}
            height={500}
            className='rounded-2xl shadow-xl'
          />
        </div>
      </section>

      <section className='bg-secondary py-20'>
        <div className='container mb-16 text-center'>
          <Typography variant='h2' className='mb-4'>
            Our Values
          </Typography>
          <Typography
            variant='p'
            className='mx-auto max-w-2xl text-muted-foreground'
          >
            These principles guide every decision we make and every feature we
            build.
          </Typography>
        </div>

        <div className='container grid gap-8 md:grid-cols-2'>
          {values.map((value) => (
            <Card key={value.title} className='border-0 shadow-sm'>
              <CardContent className='p-8'>
                <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10'>
                  <div className='text-primary'>{value.icon}</div>
                </div>
                <Typography variant='h4' component='h3' className='mb-4'>
                  {value.title}
                </Typography>
                <Typography variant='p' className='mb-0 text-muted-foreground'>
                  {value.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className='container py-20'>
        <div className='mb-16 text-center'>
          <Typography variant='h2' className='mb-4'>
            Our Journey
          </Typography>
          <Typography
            variant='p'
            className='mx-auto max-w-2xl text-muted-foreground'
          >
            From a small startup to a global platform, here's how we've grown
            and evolved.
          </Typography>
        </div>

        <div className='mx-auto max-w-4xl'>
          <div className='relative'>
            <div className='absolute top-0 bottom-0 left-8 hidden w-0.5 bg-primary/20 md:block' />

            <div className='space-y-12'>
              {timeline.map((item) => (
                <div
                  key={item.title}
                  className='relative flex items-start space-x-8'
                >
                  {/* Timeline dot */}
                  <div className='hidden h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground md:flex'>
                    {item.year}
                  </div>

                  <div className='flex-1'>
                    <div className='mb-2 md:hidden'>
                      <Badge variant='secondary'>{item.year}</Badge>
                    </div>
                    <Typography variant='h4' className='mb-3'>
                      {item.title}
                    </Typography>
                    <Typography
                      variant='p'
                      className='mb-0 text-muted-foreground'
                    >
                      {item.description}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='bg-secondary py-20'>
        <div className='container mb-16 text-center'>
          <Typography variant='h2' className='mb-4'>
            Meet Our Team
          </Typography>
          <Typography
            variant='p'
            className='mx-auto max-w-2xl text-muted-foreground'
          >
            The passionate individuals behind Yukinu, working together to
            transform e-commerce.
          </Typography>
        </div>

        <div className='container grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {team.map((member) => (
            <Card
              key={member.name}
              className='border-0 shadow-sm transition-shadow hover:shadow-md'
            >
              <CardContent className='text-center'>
                <Image
                  src={member.image}
                  alt={member.name}
                  width={200}
                  height={200}
                  className='mx-auto mb-4 h-32 w-32 rounded-full object-cover'
                />

                <Typography variant='h5'>{member.name}</Typography>

                <Typography
                  variant='caption'
                  component='p'
                  className='font-medium'
                >
                  {member.role}
                </Typography>

                <Typography
                  variant='p'
                  className='text-sm text-muted-foreground'
                >
                  {member.bio}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className='container py-20 text-center'>
        <Typography variant='h2' className='mb-6'>
          Join Our Mission
        </Typography>
        <Typography variant='p' className='mb-8 text-xl text-muted-foreground'>
          We're always looking for talented individuals who share our passion
          for innovation and customer-centric design. Come help us build the
          future of commerce.
        </Typography>

        <div className='mb-12 grid gap-6 md:grid-cols-3'>
          <div className='text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
              <UsersIcon className='h-8 w-8 text-primary' />
            </div>
            <Typography variant='h6' className='mb-2'>
              Collaborative Culture
            </Typography>
            <Typography
              variant='p'
              component='p'
              className='text-sm text-muted-foreground'
            >
              Work with brilliant minds in an environment that values diverse
              perspectives.
            </Typography>
          </div>

          <div className='text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
              <TrendingUpIcon className='h-8 w-8 text-primary' />
            </div>
            <Typography variant='h6' className='mb-2'>
              Growth Opportunities
            </Typography>
            <Typography
              variant='p'
              component='p'
              className='text-sm text-muted-foreground'
            >
              Continuous learning and career development in a fast-growing
              company.
            </Typography>
          </div>

          <div className='text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
              <AwardIcon className='h-8 w-8 text-primary' />
            </div>
            <Typography variant='h6' className='mb-2'>
              Meaningful Impact
            </Typography>
            <Typography
              variant='p'
              component='p'
              className='text-sm text-muted-foreground'
            >
              Your work directly impacts millions of users around the world.
            </Typography>
          </div>
        </div>

        <Button size='lg' asChild>
          <a
            href='https://youtu.be/9lNZ_Rnr7Jc'
            target='_blank'
            rel='noopener noreferrer'
          >
            View Open Positions
            <ArrowRightIcon />
          </a>
        </Button>
      </section>

      <section id='contact' className='bg-secondary py-20'>
        <div className='container mb-16 text-center'>
          <Typography variant='h2' className='mb-4'>
            Get in Touch
          </Typography>
          <Typography className='mx-auto max-w-2xl text-muted-foreground'>
            Have questions about Yukinu? Want to partner with us? We'd love to
            hear from you.
          </Typography>
        </div>

        <div className='container grid gap-8 md:grid-cols-3'>
          <Card className='border-0 text-center shadow-sm'>
            <CardContent className='p-8'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
                <MailIcon className='h-8 w-8 text-primary' />
              </div>
              <Typography variant='h5' className='mb-2'>
                Email Us
              </Typography>
              <Typography variant='p' className='mb-4 text-muted-foreground'>
                General inquiries and support
              </Typography>
              <Typography variant='p' className='font-medium text-primary'>
                hello@yukinu.com
              </Typography>
            </CardContent>
          </Card>

          <Card className='border-0 text-center shadow-sm'>
            <CardContent className='p-8'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
                <MapPinIcon className='h-8 w-8 text-primary' />
              </div>
              <Typography variant='h5' className='mb-2'>
                Visit Us
              </Typography>
              <Typography variant='p' className='mb-4 text-muted-foreground'>
                Our headquarters
              </Typography>
              <Typography variant='p' className='font-medium text-primary'>
                San Francisco, CA
              </Typography>
            </CardContent>
          </Card>

          <Card className='border-0 text-center shadow-sm'>
            <CardContent className='p-8'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
                <CalendarIcon className='h-8 w-8 text-primary' />
              </div>
              <Typography variant='h5' className='mb-2'>
                Schedule a Call
              </Typography>
              <Typography variant='p' className='mb-4 text-muted-foreground'>
                For partnerships and press
              </Typography>
              <Button variant='outline' size='sm' asChild>
                <a
                  href='https://youtu.be/dQw4w9WgXcQ'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Book Meeting
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
