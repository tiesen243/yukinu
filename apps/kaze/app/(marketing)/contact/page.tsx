import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@yuki/ui/badge'
import { Button } from '@yuki/ui/button'
import { Card, CardContent } from '@yuki/ui/card'
import {
  CheckCircleIcon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SendIcon,
} from '@yuki/ui/icons'
import { Input } from '@yuki/ui/input'
import { Textarea } from '@yuki/ui/textarea'
import { Typography } from '@yuki/ui/typography'

import { createMetadata } from '@/lib/metadata'
import { contactMethods, departments, offices } from './page.config'

export const metadata = createMetadata({
  title: 'Contact Us',
  description: 'Get in touch with us for any inquiries or support.',
})

export default function ContactPage() {
  return (
    <main>
      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-20 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-6">
            💬 Get in Touch
          </Badge>

          <Typography variant="h1">We're Here to Help</Typography>

          <Typography className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl">
            Have questions about Yukinu? Need support with your account? Want to
            explore partnership opportunities? Our team is ready to assist you
            every step of the way.
          </Typography>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {contactMethods.map((method) => (
              <Card
                key={method.title}
                className="border-0 shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <div className="text-primary">{method.icon}</div>
                  </div>
                  <Typography variant="h6" className="mb-2">
                    {method.title}
                  </Typography>
                  <Typography className="text-muted-foreground mb-3 text-sm">
                    {method.description}
                  </Typography>
                  <Typography className="text-primary mb-2 font-medium">
                    {method.contact}
                  </Typography>
                  <div className="space-y-1">
                    <Typography
                      variant="caption"
                      component="p"
                      className="text-muted-foreground"
                    >
                      Response: {method.responseTime}
                    </Typography>
                    <Typography
                      variant="caption"
                      component="p"
                      className="text-muted-foreground"
                    >
                      {method.availability}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container grid items-start gap-16 py-20 lg:grid-cols-2">
        <div>
          <Typography variant="h2" className="mb-6">
            Send Us a Message
          </Typography>
          <Typography className="text-muted-foreground mb-8">
            Fill out the form below and we'll get back to you as soon as
            possible. For urgent matters, please use our phone or live chat
            support.
          </Typography>

          <form className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  First Name *
                </label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Last Name *
                </label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address *
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <label
                htmlFor="company"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Company (Optional)
              </label>
              <Input id="company" placeholder="Enter your company name" />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Subject *
              </label>
              <Input
                id="subject"
                placeholder="What is this regarding?"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Message *
              </label>
              <Textarea
                id="message"
                placeholder="Tell us more about your inquiry..."
                rows={6}
                required
              />
            </div>

            <div className="flex items-start space-x-2">
              <input type="checkbox" id="consent" className="mt-1" required />
              <label
                htmlFor="consent"
                className="text-muted-foreground text-sm"
              >
                I agree to receive communications from Yukinu and understand
                that I can unsubscribe at any time. View our{' '}
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            <Button size="lg" className="w-full">
              <SendIcon className="mr-2 h-5 w-5" />
              Send Message
            </Button>
          </form>
        </div>

        <div className="space-y-8">
          <div>
            <Typography variant="h3" className="mb-6">
              Contact by Department
            </Typography>
            <Typography className="text-muted-foreground mb-8">
              Get in touch with the right team for faster assistance.
            </Typography>

            <div className="space-y-4">
              {departments.map((dept) => (
                <Card
                  key={dept.title}
                  className="border-0 shadow-sm transition-shadow hover:shadow-md"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg ${dept.color}`}
                      >
                        {dept.icon}
                      </div>
                      <div className="flex-1">
                        <Typography variant="h6" className="mb-1">
                          {dept.title}
                        </Typography>
                        <Typography className="text-muted-foreground mb-2 text-sm">
                          {dept.description}
                        </Typography>
                        <Typography className="text-primary text-sm font-medium">
                          {dept.email}
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <Typography variant="h4" className="mb-4">
              Quick Response Times
            </Typography>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <Typography className="text-sm">
                  Email support: Within 24 hours
                </Typography>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <Typography className="text-sm">
                  Live chat: Within minutes during business hours
                </Typography>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <Typography className="text-sm">
                  Phone support: Immediate assistance
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="container mb-16 text-center">
          <Typography variant="h2" className="mb-4">
            Our Global Offices
          </Typography>
          <Typography className="text-muted-foreground mx-auto max-w-2xl">
            Visit us at one of our offices around the world or reach out to your
            local team.
          </Typography>
        </div>

        <div className="container grid gap-8 md:grid-cols-3">
          {offices.map((office) => (
            <Card
              key={office.address}
              className="overflow-hidden border-0 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative">
                <Image
                  src={office.image || '/placeholder.svg'}
                  alt={`${office.city} office`}
                  width={300}
                  height={200}
                  className="h-48 w-full object-cover"
                />
                {office.isHeadquarters && (
                  <Badge className="absolute top-4 left-4">Headquarters</Badge>
                )}
              </div>
              <CardContent className="p-6">
                <Typography variant="h5" className="mb-2">
                  {office.city}
                </Typography>
                <Typography
                  variant="caption"
                  component="p"
                  className="text-muted-foreground mb-4"
                >
                  {office.country}
                </Typography>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="text-muted-foreground mt-1 h-4 w-4 flex-shrink-0" />
                    <Typography className="text-muted-foreground text-sm">
                      {office.address.split('\n').map((line, i) => (
                        <span key={line}>
                          {line}
                          {i < office.address.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </Typography>
                  </div>

                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="text-muted-foreground h-4 w-4" />
                    <Typography className="text-muted-foreground text-sm">
                      {office.phone}
                    </Typography>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MailIcon className="text-muted-foreground h-4 w-4" />
                    <Typography className="text-primary text-sm">
                      {office.email}
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container py-20">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <div className="mb-4 flex items-center space-x-3">
                  <ClockIcon className="text-primary h-8 w-8" />
                  <Typography variant="h3">Business Hours</Typography>
                </div>
                <Typography className="text-muted-foreground mb-6">
                  Our support team is available during these hours. For urgent
                  matters outside business hours, please use email support.
                </Typography>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 py-2">
                  <Typography className="font-medium">
                    Monday - Friday
                  </Typography>
                  <Typography className="text-muted-foreground">
                    9:00 AM - 6:00 PM PST
                  </Typography>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 py-2">
                  <Typography className="font-medium">Saturday</Typography>
                  <Typography className="text-muted-foreground">
                    10:00 AM - 4:00 PM PST
                  </Typography>
                </div>
                <div className="flex items-center justify-between py-2">
                  <Typography className="font-medium">Sunday</Typography>
                  <Typography className="text-muted-foreground">
                    Closed
                  </Typography>
                </div>
                <div className="bg-info/10 mt-4 rounded-lg p-4">
                  <Typography className="text-info text-sm">
                    💡 Email support is available 24/7 with responses within 24
                    hours
                  </Typography>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
