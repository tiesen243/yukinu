import Link from 'next/link'

import { Badge } from '@yuki/ui/badge'
import { Button } from '@yuki/ui/button'
import { Card, CardContent } from '@yuki/ui/card'
import {
  AlertCircleIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  DollarSignIcon,
  MapPinIcon,
  PackageIcon,
} from '@yuki/ui/icons'
import { Typography } from '@yuki/ui/typography'

import { createMetadata } from '@/lib/metadata'
import {
  deliveryFeatures,
  internationalRestrictions,
  restrictedItems,
  shippingOptions,
  shippingZones,
} from './page.config'

export const metadata = createMetadata({
  title: 'Shipping',
  description: 'Information about our shipping policies and options.',
})

export default function ShippingPage() {
  return (
    <main>
      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-20 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-6">
            🚚 Shipping Information
          </Badge>

          <Typography variant="h1" className="mb-6">
            Shipping Policy
          </Typography>

          <Typography className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl">
            Everything you need to know about our shipping options, delivery
            times, costs, and policies. We're committed to getting your orders
            to you safely and on time.
          </Typography>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {deliveryFeatures.map((feature) => (
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
            Shipping Options
          </Typography>
          <Typography className="text-muted-foreground mx-auto max-w-2xl">
            Choose the shipping method that best fits your needs and timeline.
          </Typography>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {shippingOptions.map((option) => (
            <Card
              key={option.name}
              className="shadow-sm transition-shadow hover:shadow-md"
            >
              <CardContent>
                <div className="mb-6 flex items-start space-x-4">
                  <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                    <div className="text-primary">{option.icon}</div>
                  </div>
                  <div className="flex-1">
                    <Typography variant="h4" className="mb-2">
                      {option.name}
                    </Typography>
                    <Typography className="text-muted-foreground mb-4">
                      {option.description}
                    </Typography>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="h6" className="text-primary mb-1">
                      Delivery Time
                    </Typography>
                    <Typography className="text-muted-foreground text-sm">
                      {option.timeframe}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="h6" className="text-primary mb-1">
                      Cost
                    </Typography>
                    <Typography className="text-muted-foreground text-sm">
                      {option.cost}
                    </Typography>
                  </div>
                </div>

                <div>
                  <Typography variant="h6" className="mb-3">
                    Features
                  </Typography>
                  <ul className="space-y-2">
                    {option.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-2">
                        <CheckCircleIcon className="text-success h-4 w-4" />
                        <Typography className="text-muted-foreground text-sm">
                          {feature}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="container">
          <div className="mb-16 text-center">
            <Typography variant="h2" className="mb-4">
              Shipping Zones & Rates
            </Typography>
            <Typography className="text-muted-foreground mx-auto max-w-2xl">
              Shipping costs and delivery times vary by destination. Find your
              shipping zone below.
            </Typography>
          </div>

          <div className="grid gap-6">
            {shippingZones.map((zone) => (
              <Card key={zone.zone} className="border-0 shadow-sm">
                <CardContent>
                  <div className="grid items-center gap-4 md:grid-cols-5">
                    <div>
                      <Typography variant="h6" className="mb-1">
                        {zone.zone}
                      </Typography>
                      <Typography className="text-muted-foreground text-sm">
                        {zone.regions.join(', ')}
                      </Typography>
                    </div>
                    <div className="text-center">
                      <Typography
                        variant="caption"
                        component="p"
                        className="text-muted-foreground mb-1"
                      >
                        Standard
                      </Typography>
                      <Typography className="text-sm font-medium">
                        {zone.standardTime}
                      </Typography>
                    </div>
                    <div className="text-center">
                      <Typography
                        variant="caption"
                        component="p"
                        className="text-muted-foreground mb-1"
                      >
                        Express
                      </Typography>
                      <Typography className="text-sm font-medium">
                        {zone.expressTime}
                      </Typography>
                    </div>
                    <div className="text-center">
                      <Typography
                        variant="caption"
                        component="p"
                        className="text-muted-foreground mb-1"
                      >
                        Starting Cost
                      </Typography>
                      <Typography className="text-primary text-sm font-medium">
                        {zone.cost}
                      </Typography>
                    </div>
                    <div className="text-center">
                      <Button variant="outline" size="sm" disabled>
                        Calculate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20">
        <Typography variant="h2" className="mb-12 text-center">
          Processing & Handling
        </Typography>

        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8">
              <div className="mb-4 flex items-center space-x-3">
                <CalendarIcon className="text-primary h-6 w-6" />
                <Typography variant="h4">Processing Time</Typography>
              </div>
              <Typography className="text-muted-foreground mb-6">
                Most orders are processed within 1-2 business days. Custom or
                personalized items may take longer.
              </Typography>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Typography className="text-sm">Standard items</Typography>
                  <Typography className="text-sm font-medium">
                    1-2 business days
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-sm">Custom items</Typography>
                  <Typography className="text-sm font-medium">
                    3-5 business days
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-sm">Pre-orders</Typography>
                  <Typography className="text-sm font-medium">
                    As specified
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-8">
              <div className="mb-4 flex items-center space-x-3">
                <PackageIcon className="text-primary h-6 w-6" />
                <Typography variant="h4">Packaging</Typography>
              </div>
              <Typography className="text-muted-foreground mb-6">
                All items are carefully packaged to ensure they arrive in
                perfect condition.
              </Typography>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="text-success h-4 w-4" />
                  <Typography className="text-sm">
                    Protective packaging materials
                  </Typography>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="text-success h-4 w-4" />
                  <Typography className="text-sm">
                    Eco-friendly packaging options
                  </Typography>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="text-success h-4 w-4" />
                  <Typography className="text-sm">
                    Fragile item special handling
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-info/10 border-0 shadow-sm">
          <CardContent className="p-8">
            <div className="flex items-start space-x-4">
              <AlertCircleIcon className="text-info mt-1 h-6 w-6" />
              <div>
                <Typography variant="h5" className="text-info mb-3">
                  Order Cutoff Times
                </Typography>
                <Typography className="text-info/80 mb-4">
                  To ensure same-day processing, orders must be placed by the
                  following times:
                </Typography>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Typography className="text-info font-medium">
                      Monday - Friday: 2:00 PM EST
                    </Typography>
                    <Typography className="text-info/80 text-sm">
                      Orders placed after will be processed next business day
                    </Typography>
                  </div>
                  <div>
                    <Typography className="text-info font-medium">
                      Weekends: No processing
                    </Typography>
                    <Typography className="text-info/80 text-sm">
                      Weekend orders processed on Monday
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="bg-secondary py-20">
        <div className="container">
          <div className="mb-16 text-center">
            <Typography variant="h2" className="mb-4">
              International Shipping
            </Typography>
            <Typography className="text-muted-foreground mx-auto max-w-2xl">
              We ship worldwide with customs handling and duty calculation
              included.
            </Typography>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-2">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8">
                <Typography variant="h4" className="mb-6">
                  Important Information
                </Typography>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <DollarSignIcon className="text-primary mt-1 h-5 w-5" />
                    <div>
                      <Typography variant="h6" className="mb-1">
                        Duties & Taxes
                      </Typography>
                      <Typography className="text-muted-foreground text-sm">
                        Additional duties and taxes may apply based on your
                        country's regulations. These are not included in our
                        shipping costs.
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ClockIcon className="text-primary mt-1 h-5 w-5" />
                    <div>
                      <Typography variant="h6" className="mb-1">
                        Customs Clearance
                      </Typography>
                      <Typography className="text-muted-foreground text-sm">
                        International shipments may be delayed by customs
                        processing. This is beyond our control and not included
                        in delivery estimates.
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="text-primary mt-1 h-5 w-5" />
                    <div>
                      <Typography variant="h6" className="mb-1">
                        Address Accuracy
                      </Typography>
                      <Typography className="text-muted-foreground text-sm">
                        Ensure your address is complete and accurate. Incorrect
                        addresses may result in additional fees or returned
                        packages.
                      </Typography>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-8">
                <Typography variant="h4" className="mb-6">
                  Restricted Items
                </Typography>
                <Typography className="text-muted-foreground mb-4">
                  The following items cannot be shipped internationally:
                </Typography>
                <ul className="space-y-2">
                  {restrictedItems.map((item) => (
                    <li key={item} className="flex items-center space-x-2">
                      <AlertCircleIcon className="text-error h-4 w-4" />
                      <Typography className="text-muted-foreground text-sm">
                        {item}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div>
            <Typography variant="h3" className="mb-8 text-center">
              Country-Specific Information
            </Typography>
            <div className="grid gap-6 md:grid-cols-2">
              {internationalRestrictions.map((country) => (
                <Card key={country.country} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <Typography variant="h5" className="mb-4">
                      {country.country}
                    </Typography>
                    <div className="space-y-3">
                      <div>
                        <Typography variant="h6" className="mb-2 text-sm">
                          Restrictions
                        </Typography>
                        <ul className="space-y-1">
                          {country.restrictions.map((restriction) => (
                            <li key={restriction}>
                              <Typography className="text-muted-foreground text-sm">
                                • {restriction}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <Typography variant="h6" className="mb-1 text-sm">
                          Duties & Taxes
                        </Typography>
                        <Typography className="text-muted-foreground text-sm">
                          {country.duties}
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <Typography variant="h2" className="mb-12 text-center">
          Tracking & Support
        </Typography>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border-0 shadow-sm">
            <CardContent>
              <Typography variant="h4" className="mb-6">
                Order Tracking
              </Typography>
              <Typography className="text-muted-foreground mb-6">
                Stay updated on your order's progress with our comprehensive
                tracking system.
              </Typography>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <Typography className="text-primary text-xs font-bold">
                      1
                    </Typography>
                  </div>
                  <div>
                    <Typography className="text-sm font-medium">
                      Order Confirmed
                    </Typography>
                    <Typography className="text-muted-foreground text-xs">
                      You'll receive an email confirmation
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <Typography className="text-primary text-xs font-bold">
                      2
                    </Typography>
                  </div>
                  <div>
                    <Typography className="text-sm font-medium">
                      Processing
                    </Typography>
                    <Typography className="text-muted-foreground text-xs">
                      Your order is being prepared
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <Typography className="text-primary text-xs font-bold">
                      3
                    </Typography>
                  </div>
                  <div>
                    <Typography className="text-sm font-medium">
                      Shipped
                    </Typography>
                    <Typography className="text-muted-foreground text-xs">
                      Tracking number provided
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <Typography className="text-primary text-xs font-bold">
                      4
                    </Typography>
                  </div>
                  <div>
                    <Typography className="text-sm font-medium">
                      Delivered
                    </Typography>
                    <Typography className="text-muted-foreground text-xs">
                      Package arrives at your door
                    </Typography>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent>
              <Typography variant="h4" className="mb-6">
                Shipping Support
              </Typography>
              <Typography className="text-muted-foreground mb-6">
                Need help with your shipment? Our support team is here to assist
                you.
              </Typography>
              <div className="space-y-4">
                <div className="bg-secondary rounded-lg p-4">
                  <Typography variant="h6" className="mb-2">
                    Lost or Damaged Package
                  </Typography>
                  <Typography className="text-muted-foreground mb-3 text-sm">
                    We'll investigate and provide a replacement or refund.
                  </Typography>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://youtu.be/9lNZ_Rnr7Jc"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Report Issue
                    </a>
                  </Button>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <Typography variant="h6" className="mb-2">
                    Delivery Questions
                  </Typography>
                  <Typography className="text-muted-foreground mb-3 text-sm">
                    Questions about delivery times or shipping options.
                  </Typography>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <Typography variant="h6" className="mb-2">
                    Address Changes
                  </Typography>
                  <Typography className="text-muted-foreground mb-3 text-sm">
                    Need to update your delivery address before shipping.
                  </Typography>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/profile/address">Update Address</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
