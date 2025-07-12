import Link from 'next/link'

import { Badge } from '@yuki/ui/badge'
import { Button } from '@yuki/ui/button'
import { Card, CardContent } from '@yuki/ui/card'
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Globe,
  MapPin,
  Package,
  Shield,
  Truck,
} from '@yuki/ui/icons'
import { Typography } from '@yuki/ui/typography'

import { createMetadata } from '@/lib/metadata'
import {
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
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6">
              🚚 Shipping Information
            </Badge>

            <Typography variant="h1" className="mb-6">
              Shipping Policy
            </Typography>

            <Typography
              variant="p"
              className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl"
            >
              Everything you need to know about our shipping options, delivery
              times, costs, and policies. We're committed to getting your orders
              to you safely and on time.
            </Typography>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                  <Truck className="text-primary h-8 w-8" />
                </div>
                <Typography variant="h6" className="mb-2">
                  Fast Delivery
                </Typography>
                <Typography
                  variant="caption"
                  component="p"
                  className="text-muted-foreground"
                >
                  Multiple shipping speeds available
                </Typography>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                  <Shield className="text-primary h-8 w-8" />
                </div>
                <Typography variant="h6" className="mb-2">
                  Secure Packaging
                </Typography>
                <Typography
                  variant="caption"
                  component="p"
                  className="text-muted-foreground"
                >
                  All items carefully protected
                </Typography>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                  <Globe className="text-primary h-8 w-8" />
                </div>
                <Typography variant="h6" className="mb-2">
                  Worldwide Shipping
                </Typography>
                <Typography
                  variant="caption"
                  component="p"
                  className="text-muted-foreground"
                >
                  Delivery to 150+ countries
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <Typography variant="h2" className="mb-4">
                Shipping Options
              </Typography>
              <Typography
                variant="p"
                className="text-muted-foreground mx-auto max-w-2xl"
              >
                Choose the shipping method that best fits your needs and
                timeline.
              </Typography>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {shippingOptions.map((option) => (
                <Card
                  key={option.name}
                  className="border-0 shadow-sm transition-shadow hover:shadow-md"
                >
                  <CardContent className="p-8">
                    <div className="mb-6 flex items-start space-x-4">
                      <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                        <div className="text-primary">{option.icon}</div>
                      </div>
                      <div className="flex-1">
                        <Typography variant="h4" className="mb-2">
                          {option.name}
                        </Typography>
                        <Typography
                          variant="p"
                          className="text-muted-foreground mb-4"
                        >
                          {option.description}
                        </Typography>
                      </div>
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-4">
                      <div>
                        <Typography variant="h6" className="text-primary mb-1">
                          Delivery Time
                        </Typography>
                        <Typography
                          variant="p"
                          className="text-muted-foreground text-sm"
                        >
                          {option.timeframe}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="h6" className="text-primary mb-1">
                          Cost
                        </Typography>
                        <Typography
                          variant="p"
                          className="text-muted-foreground text-sm"
                        >
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
                          <li
                            key={feature}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <Typography
                              variant="p"
                              className="text-muted-foreground text-sm"
                            >
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
          </div>
        </div>
      </section>

      {/* Shipping Zones */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <Typography variant="h2" className="mb-4">
                Shipping Zones & Rates
              </Typography>
              <Typography
                variant="p"
                className="text-muted-foreground mx-auto max-w-2xl"
              >
                Shipping costs and delivery times vary by destination. Find your
                shipping zone below.
              </Typography>
            </div>

            <div className="grid gap-6">
              {shippingZones.map((zone) => (
                <Card key={zone.zone} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="grid items-center gap-4 md:grid-cols-5">
                      <div>
                        <Typography variant="h6" className="mb-1">
                          {zone.zone}
                        </Typography>
                        <Typography
                          variant="p"
                          className="text-muted-foreground text-sm"
                        >
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
                        <Typography variant="p" className="text-sm font-medium">
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
                        <Typography variant="p" className="text-sm font-medium">
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
                        <Typography
                          variant="p"
                          className="text-primary text-sm font-medium"
                        >
                          {zone.cost}
                        </Typography>
                      </div>
                      <div className="text-center">
                        <Button variant="outline" size="sm">
                          Calculate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Processing & Handling */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Typography variant="h2" className="mb-12 text-center">
              Processing & Handling
            </Typography>

            <div className="mb-12 grid gap-8 md:grid-cols-2">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <div className="mb-4 flex items-center space-x-3">
                    <Calendar className="text-primary h-6 w-6" />
                    <Typography variant="h4">Processing Time</Typography>
                  </div>
                  <Typography
                    variant="p"
                    className="text-muted-foreground mb-6"
                  >
                    Most orders are processed within 1-2 business days. Custom
                    or personalized items may take longer.
                  </Typography>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Typography variant="p" className="text-sm">
                        Standard items
                      </Typography>
                      <Typography variant="p" className="text-sm font-medium">
                        1-2 business days
                      </Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography variant="p" className="text-sm">
                        Custom items
                      </Typography>
                      <Typography variant="p" className="text-sm font-medium">
                        3-5 business days
                      </Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography variant="p" className="text-sm">
                        Pre-orders
                      </Typography>
                      <Typography variant="p" className="text-sm font-medium">
                        As specified
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <div className="mb-4 flex items-center space-x-3">
                    <Package className="text-primary h-6 w-6" />
                    <Typography variant="h4">Packaging</Typography>
                  </div>
                  <Typography
                    variant="p"
                    className="text-muted-foreground mb-6"
                  >
                    All items are carefully packaged to ensure they arrive in
                    perfect condition.
                  </Typography>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <Typography variant="p" className="text-sm">
                        Protective packaging materials
                      </Typography>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <Typography variant="p" className="text-sm">
                        Eco-friendly packaging options
                      </Typography>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <Typography variant="p" className="text-sm">
                        Fragile item special handling
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 bg-blue-50 shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <AlertCircle className="mt-1 h-6 w-6 text-blue-600" />
                  <div>
                    <Typography variant="h5" className="mb-3 text-blue-900">
                      Order Cutoff Times
                    </Typography>
                    <Typography variant="p" className="mb-4 text-blue-800">
                      To ensure same-day processing, orders must be placed by
                      the following times:
                    </Typography>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Typography
                          variant="p"
                          className="font-medium text-blue-900"
                        >
                          Monday - Friday: 2:00 PM EST
                        </Typography>
                        <Typography
                          variant="p"
                          className="text-sm text-blue-700"
                        >
                          Orders placed after will be processed next business
                          day
                        </Typography>
                      </div>
                      <div>
                        <Typography
                          variant="p"
                          className="font-medium text-blue-900"
                        >
                          Weekends: No processing
                        </Typography>
                        <Typography
                          variant="p"
                          className="text-sm text-blue-700"
                        >
                          Weekend orders processed on Monday
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* International Shipping */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <Typography variant="h2" className="mb-4">
                International Shipping
              </Typography>
              <Typography
                variant="p"
                className="text-muted-foreground mx-auto max-w-2xl"
              >
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
                      <DollarSign className="text-primary mt-1 h-5 w-5" />
                      <div>
                        <Typography variant="h6" className="mb-1">
                          Duties & Taxes
                        </Typography>
                        <Typography
                          variant="p"
                          className="text-muted-foreground text-sm"
                        >
                          Additional duties and taxes may apply based on your
                          country's regulations. These are not included in our
                          shipping costs.
                        </Typography>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="text-primary mt-1 h-5 w-5" />
                      <div>
                        <Typography variant="h6" className="mb-1">
                          Customs Clearance
                        </Typography>
                        <Typography
                          variant="p"
                          className="text-muted-foreground text-sm"
                        >
                          International shipments may be delayed by customs
                          processing. This is beyond our control and not
                          included in delivery estimates.
                        </Typography>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="text-primary mt-1 h-5 w-5" />
                      <div>
                        <Typography variant="h6" className="mb-1">
                          Address Accuracy
                        </Typography>
                        <Typography
                          variant="p"
                          className="text-muted-foreground text-sm"
                        >
                          Ensure your address is complete and accurate.
                          Incorrect addresses may result in additional fees or
                          returned packages.
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
                  <Typography
                    variant="p"
                    className="text-muted-foreground mb-4"
                  >
                    The following items cannot be shipped internationally:
                  </Typography>
                  <ul className="space-y-2">
                    {restrictedItems.map((item) => (
                      <li key={item} className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <Typography
                          variant="p"
                          className="text-muted-foreground text-sm"
                        >
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
                                <Typography
                                  variant="p"
                                  className="text-muted-foreground text-sm"
                                >
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
                          <Typography
                            variant="p"
                            className="text-muted-foreground text-sm"
                          >
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
        </div>
      </section>

      {/* Tracking & Support */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Typography variant="h2" className="mb-12 text-center">
              Tracking & Support
            </Typography>

            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <Typography variant="h4" className="mb-6">
                    Order Tracking
                  </Typography>
                  <Typography
                    variant="p"
                    className="text-muted-foreground mb-6"
                  >
                    Stay updated on your order's progress with our comprehensive
                    tracking system.
                  </Typography>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                        <Typography
                          variant="p"
                          className="text-primary text-xs font-bold"
                        >
                          1
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="p" className="text-sm font-medium">
                          Order Confirmed
                        </Typography>
                        <Typography
                          variant="p"
                          className="text-muted-foreground text-xs"
                        >
                          You'll receive an email confirmation
                        </Typography>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                        <Typography
                          variant="p"
                          className="text-primary text-xs font-bold"
                        >
                          2
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="p" className="text-sm font-medium">
                          Processing
                        </Typography>
                        <Typography
                          variant="p"
                          className="text-muted-foreground text-xs"
                        >
                          Your order is being prepared
                        </Typography>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                        <Typography
                          variant="p"
                          className="text-primary text-xs font-bold"
                        >
                          3
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="p" className="text-sm font-medium">
                          Shipped
                        </Typography>
                        <Typography
                          variant="p"
                          className="text-muted-foreground text-xs"
                        >
                          Tracking number provided
                        </Typography>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                        <Typography
                          variant="p"
                          className="text-primary text-xs font-bold"
                        >
                          4
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="p" className="text-sm font-medium">
                          Delivered
                        </Typography>
                        <Typography
                          variant="p"
                          className="text-muted-foreground text-xs"
                        >
                          Package arrives at your door
                        </Typography>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <Typography variant="h4" className="mb-6">
                    Shipping Support
                  </Typography>
                  <Typography
                    variant="p"
                    className="text-muted-foreground mb-6"
                  >
                    Need help with your shipment? Our support team is here to
                    assist you.
                  </Typography>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <Typography variant="h6" className="mb-2">
                        Lost or Damaged Package
                      </Typography>
                      <Typography
                        variant="p"
                        className="text-muted-foreground mb-3 text-sm"
                      >
                        We'll investigate and provide a replacement or refund.
                      </Typography>
                      <Button variant="outline" size="sm">
                        Report Issue
                      </Button>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <Typography variant="h6" className="mb-2">
                        Delivery Questions
                      </Typography>
                      <Typography
                        variant="p"
                        className="text-muted-foreground mb-3 text-sm"
                      >
                        Questions about delivery times or shipping options.
                      </Typography>
                      <Button variant="outline" size="sm">
                        Contact Support
                      </Button>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <Typography variant="h6" className="mb-2">
                        Address Changes
                      </Typography>
                      <Typography
                        variant="p"
                        className="text-muted-foreground mb-3 text-sm"
                      >
                        Need to update your delivery address before shipping.
                      </Typography>
                      <Button variant="outline" size="sm">
                        Update Address
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <Typography variant="h3" className="mb-4 text-white">
            Questions About Shipping?
          </Typography>
          <Typography
            variant="p"
            className="mx-auto mb-8 max-w-2xl text-blue-100"
          >
            Our shipping specialists are ready to help you choose the best
            delivery option for your needs.
          </Typography>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Contact Support
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/faq">
              <Button
                size="lg"
                variant="outline"
                className="border-white bg-transparent text-white hover:bg-white hover:text-blue-600"
              >
                View FAQ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
