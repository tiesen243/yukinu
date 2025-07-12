import { ClockIcon, GlobeIcon, PackageIcon, TruckIcon } from '@yuki/ui/icons'

export const deliveryFeatures = [
  {
    icon: <TruckIcon className="h-6 w-6" />,
    title: 'Fast Delivery',
    description: 'Multiple shipping speeds available',
  },
  {
    icon: <ClockIcon className="h-6 w-6" />,
    title: 'Secure Packaging',
    description: 'All items carefully protected',
  },
  {
    icon: <GlobeIcon className="h-6 w-6" />,
    title: 'Worldwide Shipping',
    description: 'Delivery to 150+ countries',
  },
]

export const shippingOptions = [
  {
    name: 'Standard Shipping',
    icon: <TruckIcon className="h-6 w-6" />,
    timeframe: '5-7 business days',
    cost: 'Free on orders $50+, otherwise $5.99',
    description: 'Reliable delivery for everyday orders',
    features: [
      'Package tracking',
      'Delivery confirmation',
      'Insurance included',
    ],
  },
  {
    name: 'Express Shipping',
    icon: <ClockIcon className="h-6 w-6" />,
    timeframe: '2-3 business days',
    cost: '$12.99',
    description: 'Faster delivery when you need it sooner',
    features: ['Priority handling', 'Real-time tracking', 'Signature required'],
  },
  {
    name: 'Overnight Shipping',
    icon: <PackageIcon className="h-6 w-6" />,
    timeframe: '1 business day',
    cost: '$24.99',
    description: 'Next-day delivery for urgent orders',
    features: [
      'Guaranteed delivery',
      'Morning delivery option',
      'Full insurance',
    ],
  },
  {
    name: 'International Shipping',
    icon: <GlobeIcon className="h-6 w-6" />,
    timeframe: '7-21 business days',
    cost: 'Varies by destination',
    description: 'Worldwide delivery to 150+ countries',
    features: ['Customs handling', 'Duty calculator', 'International tracking'],
  },
]

export const shippingZones = [
  {
    zone: 'Zone 1 - Local',
    regions: ['Same city/metropolitan area'],
    standardTime: '1-2 business days',
    expressTime: 'Same day available',
    cost: 'From $3.99',
  },
  {
    zone: 'Zone 2 - Regional',
    regions: ['Within 500 miles'],
    standardTime: '2-4 business days',
    expressTime: '1-2 business days',
    cost: 'From $5.99',
  },
  {
    zone: 'Zone 3 - National',
    regions: ['Nationwide (Continental US)'],
    standardTime: '5-7 business days',
    expressTime: '2-3 business days',
    cost: 'From $7.99',
  },
  {
    zone: 'Zone 4 - Extended',
    regions: ['Alaska, Hawaii, US Territories'],
    standardTime: '7-10 business days',
    expressTime: '3-5 business days',
    cost: 'From $12.99',
  },
  {
    zone: 'Zone 5 - International',
    regions: ['Canada, Mexico'],
    standardTime: '7-14 business days',
    expressTime: '3-7 business days',
    cost: 'From $19.99',
  },
  {
    zone: 'Zone 6 - Worldwide',
    regions: ['All other countries'],
    standardTime: '10-21 business days',
    expressTime: '5-10 business days',
    cost: 'From $29.99',
  },
]

export const restrictedItems = [
  'Hazardous materials and chemicals',
  'Flammable liquids and gases',
  'Weapons and ammunition',
  'Live animals and plants',
  'Perishable food items',
  'Prescription medications',
  'Counterfeit or illegal items',
  'Items exceeding size/weight limits',
]

export const internationalRestrictions = [
  {
    country: 'European Union',
    restrictions: [
      'Electronics require CE marking',
      'Food items restricted',
      'Textiles need composition labels',
    ],
    duties: 'VAT applies to orders over €22',
  },
  {
    country: 'Canada',
    restrictions: [
      'Dairy products prohibited',
      'Certain electronics restricted',
      'Textiles require labeling',
    ],
    duties: 'Duties apply to orders over CAD $20',
  },
  {
    country: 'Australia',
    restrictions: [
      'Strict biosecurity laws',
      'Electronics need compliance',
      'Quarantine for organic items',
    ],
    duties: 'GST applies to orders over AUD $1000',
  },
  {
    country: 'United Kingdom',
    restrictions: [
      'Post-Brexit regulations apply',
      'VAT on all imports',
      'Restricted food items',
    ],
    duties: 'VAT and duties may apply',
  },
]
