import { Badge } from '@yuki/ui/badge'
import { Card, CardContent } from '@yuki/ui/card'
import {
  CheckCircleIcon,
  DollarSignIcon,
  RefreshCwIcon,
  XCircleIcon,
} from '@yuki/ui/icons'
import { Typography } from '@yuki/ui/typography'

import { createMetadata } from '@/lib/metadata'
import {
  nonReturnableItems,
  returnEligibility,
  returnFeatures,
  returnProcessSteps,
} from './page.config'

export const metadata = createMetadata({
  title: 'Returns',
  description: 'Information about our returns policy and process.',
})

export default function ReturnsPolicyPage() {
  return (
    <main>
      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-20 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-6">
            🔄 Easy Returns
          </Badge>

          <Typography variant="h1" className="mb-6">
            Returns & Refunds Policy
          </Typography>

          <Typography className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl">
            Your satisfaction is our priority. Learn about our straightforward
            process for returns, refunds, and exchanges to ensure a hassle-free
            shopping experience.
          </Typography>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {returnFeatures.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow-sm">
                  {feature.icon}
                </div>
                <Typography variant="h6" className="mb-2">
                  {feature.title}
                </Typography>
                <Typography
                  variant="caption"
                  component="p"
                  className="text-muted-foreground"
                >
                  {feature.description}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="mb-16 text-center">
          <Typography variant="h2" className="mb-4">
            Return Eligibility
          </Typography>
          <Typography className="text-muted-foreground mx-auto max-w-2xl">
            To be eligible for a return, your item must meet the following
            criteria:
          </Typography>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {returnEligibility.map((item) => (
            <Card
              key={item.title}
              className="border-0 shadow-sm transition-shadow hover:shadow-md"
            >
              <CardContent className="p-8 text-center">
                <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <div className="text-primary">{item.icon}</div>
                </div>
                <Typography variant="h5" className="mb-2">
                  {item.title}
                </Typography>
                <Typography className="text-muted-foreground mb-0">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="container">
          <Typography variant="h2" className="mb-12 text-center">
            How to Make a Return
          </Typography>
          <Typography className="text-muted-foreground mx-auto mb-12 max-w-2xl text-center">
            Follow these simple steps to return your item and receive a refund
            or exchange.
          </Typography>

          <div className="relative">
            <div className="bg-primary/20 absolute top-0 bottom-0 left-8 hidden w-0.5 md:block"></div>

            <div className="space-y-12">
              {returnProcessSteps.map((step) => (
                <div
                  key={step.step}
                  className="relative flex items-start space-x-8"
                >
                  <div className="bg-primary text-primary-foreground hidden h-16 w-16 flex-shrink-0 items-center justify-center rounded-full font-bold md:flex">
                    {step.step}
                  </div>

                  <div className="flex-1">
                    <div className="mb-2 md:hidden">
                      <Badge variant="secondary">Step {step.step}</Badge>
                    </div>
                    <Typography variant="h4" className="mb-3">
                      {step.title}
                    </Typography>
                    <Typography className="text-muted-foreground mb-0">
                      {step.description}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="mb-16 text-center">
          <Typography variant="h2" className="mb-4">
            Refunds & Exchanges
          </Typography>
          <Typography className="text-muted-foreground mx-auto max-w-2xl">
            Understand how your refund will be processed and our policy on
            product exchanges.
          </Typography>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8">
              <div className="mb-4 flex items-center space-x-3">
                <DollarSignIcon className="text-primary h-6 w-6" />
                <Typography variant="h4" className="mb-0">
                  Refunds
                </Typography>
              </div>
              <Typography className="text-muted-foreground mb-6">
                Once your return is received and inspected, we will send you an
                email to notify you that we have received your returned item. We
                will also notify you of the approval or rejection of your
                refund.
              </Typography>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircleIcon className="text-success mt-1 h-5 w-5 flex-shrink-0" />
                  <div>
                    <Typography variant="h6" className="mb-1">
                      Processing Time
                    </Typography>
                    <Typography className="text-muted-foreground text-sm">
                      If approved, your refund will be processed, and a credit
                      will automatically be applied to your original method of
                      payment, within 5-7 business days.
                    </Typography>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircleIcon className="text-success mt-1 h-5 w-5 flex-shrink-0" />
                  <div>
                    <Typography variant="h6" className="mb-1">
                      Partial Refunds
                    </Typography>
                    <Typography className="text-muted-foreground text-sm">
                      Partial refunds may be granted for items not in their
                      original condition, damaged, or missing parts for reasons
                      not due to our error.
                    </Typography>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-8">
              <div className="mb-4 flex items-center space-x-3">
                <RefreshCwIcon className="text-primary h-6 w-6" />
                <Typography variant="h4" className="mb-0">
                  Exchanges
                </Typography>
              </div>
              <Typography className="text-muted-foreground mb-6">
                We only replace items if they are defective or damaged. If you
                need to exchange it for the same item, please contact our
                support team.
              </Typography>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircleIcon className="text-success mt-1 h-5 w-5 flex-shrink-0" />
                  <div>
                    <Typography variant="h6" className="mb-1">
                      Defective/Damaged Items
                    </Typography>
                    <Typography className="text-muted-foreground text-sm">
                      Contact us immediately with photos of the damage. We'll
                      arrange a replacement or refund.
                    </Typography>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircleIcon className="text-success mt-1 h-5 w-5 flex-shrink-0" />
                  <div>
                    <Typography variant="h6" className="mb-1">
                      Size/Color Exchanges
                    </Typography>
                    <Typography className="text-muted-foreground text-sm">
                      For non-defective items, please return the original item
                      for a refund and place a new order for the desired
                      size/color.
                    </Typography>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="container">
          <Typography variant="h2" className="mb-12 text-center">
            Non-Returnable Items
          </Typography>
          <Typography className="text-muted-foreground mx-auto mb-8 max-w-2xl text-center">
            Certain types of items cannot be returned. Please review the list
            below before initiating a return.
          </Typography>

          <Card className="bg-error/10 border-0 shadow-sm">
            <CardContent className="p-8">
              <div className="mb-6 flex items-start space-x-4">
                <XCircleIcon className="text-error h-8 w-8 flex-shrink-0" />
                <div>
                  <Typography variant="h4" className="text-error mb-2">
                    Items Not Eligible for Return
                  </Typography>
                  <Typography className="text-error/80 mb-4">
                    For hygiene, safety, or customization reasons, the following
                    items are generally non-returnable:
                  </Typography>
                </div>
              </div>
              <ul className="space-y-2">
                {nonReturnableItems.map((item) => (
                  <li key={item} className="flex items-center space-x-2">
                    <XCircleIcon className="text-error/50 h-4 w-4 flex-shrink-0" />
                    <Typography className="text-error/80 text-sm">
                      {item}
                    </Typography>
                  </li>
                ))}
              </ul>
              <Typography className="text-error/80 mt-6 text-sm">
                *This list is not exhaustive. Please check individual product
                pages for specific return policies.
              </Typography>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container py-20">
        <Typography variant="h2" className="mb-12 text-center">
          Return Shipping Costs
        </Typography>
        <Typography className="text-muted-foreground mx-auto mb-8 max-w-2xl text-center">
          Understanding who covers the shipping costs for returns.
        </Typography>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8">
              <div className="mb-4 flex items-center space-x-3">
                <CheckCircleIcon className="text-success h-6 w-6" />
                <Typography variant="h4">Covered by Yukinu</Typography>
              </div>
              <Typography className="text-muted-foreground mb-6">
                We will cover the return shipping costs if:
              </Typography>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon className="text-success h-4 w-4" />
                  <Typography className="text-muted-foreground text-sm">
                    The item is defective or damaged upon arrival.
                  </Typography>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon className="text-success h-4 w-4" />
                  <Typography className="text-muted-foreground text-sm">
                    You received the wrong item.
                  </Typography>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon className="text-success h-4 w-4" />
                  <Typography className="text-muted-foreground text-sm">
                    The item does not match the product description.
                  </Typography>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-8">
              <div className="mb-4 flex items-center space-x-3">
                <DollarSignIcon className="text-primary h-6 w-6" />
                <Typography variant="h4">Covered by Customer</Typography>
              </div>
              <Typography className="text-muted-foreground mb-6">
                Customers are responsible for return shipping costs if:
              </Typography>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <XCircleIcon className="text-error h-4 w-4" />
                  <Typography className="text-muted-foreground text-sm">
                    You changed your mind about the purchase.
                  </Typography>
                </li>
                <li className="flex items-center space-x-2">
                  <XCircleIcon className="text-error h-4 w-4" />
                  <Typography className="text-muted-foreground text-sm">
                    The item does not fit (unless size exchange policy applies).
                  </Typography>
                </li>
                <li className="flex items-center space-x-2">
                  <XCircleIcon className="text-error h-4 w-4" />
                  <Typography className="text-muted-foreground text-sm">
                    You ordered the wrong item.
                  </Typography>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
