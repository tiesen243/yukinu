import Link from 'next/link'

import { Badge } from '@yuki/ui/badge'
import { Button } from '@yuki/ui/button'
import { Card, CardContent } from '@yuki/ui/card'
import {
  ArrowRightIcon,
  MailIcon,
  MessageSquareIcon,
  PhoneIcon,
} from '@yuki/ui/icons'
import { Typography } from '@yuki/ui/typography'

import { createMetadata } from '@/lib/metadata'
import { FaqList, FaqProvider, FaqSearch } from './page.client'

export const metadata = createMetadata({
  title: 'FAQ',
  description: 'Frequently Asked Questions about our products and services.',
})

export default function FAQPage() {
  return (
    <main>
      <FaqProvider>
        <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-20 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
          <div className="container text-center">
            <Badge variant="secondary" className="mb-6">
              ❓ Frequently Asked Questions
            </Badge>

            <Typography variant="h1" className="mb-6">
              How Can We Help You?
            </Typography>

            <Typography
              variant="p"
              className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl"
            >
              Find quick answers to common questions about Yukinu. Search below
              or browse by category to get the help you need.
            </Typography>

            <FaqSearch />

            <Typography variant="p" className="text-muted-foreground">
              Can't find what you're looking for?{' '}
              <Link
                href="/contact"
                className="text-primary font-medium hover:underline"
              >
                Contact our support team
              </Link>
            </Typography>
          </div>
        </section>

        <FaqList />
      </FaqProvider>

      <section className="container py-16">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8 text-center">
            <Typography variant="h3" className="mb-4">
              Still Need Help?
            </Typography>
            <Typography
              variant="p"
              className="text-muted-foreground mx-auto mb-8 max-w-2xl"
            >
              Can't find the answer you're looking for? Our support team is here
              to help you with any questions or issues you might have.
            </Typography>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <MessageSquareIcon className="text-primary h-8 w-8" />
                </div>
                <Typography variant="h6" className="mb-2">
                  Live Chat
                </Typography>
                <Typography
                  variant="p"
                  className="text-muted-foreground mb-4 text-sm"
                >
                  Chat with our support team in real-time
                </Typography>
                <Button variant="outline" size="sm">
                  Start Chat
                </Button>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <MailIcon className="text-primary h-8 w-8" />
                </div>
                <Typography variant="h6" className="mb-2">
                  Email Support
                </Typography>
                <Typography
                  variant="p"
                  className="text-muted-foreground mb-4 text-sm"
                >
                  Get detailed help via email
                </Typography>
                <Button variant="outline" size="sm">
                  Send Email
                </Button>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <PhoneIcon className="text-primary h-8 w-8" />
                </div>
                <Typography variant="h6" className="mb-2">
                  Phone Support
                </Typography>
                <Typography
                  variant="p"
                  className="text-muted-foreground mb-4 text-sm"
                >
                  Speak directly with our team
                </Typography>
                <Button variant="outline" size="sm">
                  Call Now
                </Button>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <Typography variant="p" className="text-muted-foreground mb-4">
                Or visit our comprehensive help center
              </Typography>
              <Link href="/contact">
                <Button>
                  Contact Support
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
