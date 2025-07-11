import {
  BuildingIcon,
  GlobeIcon,
  HeadphonesIcon,
  MailIcon,
  MessageSquareIcon,
  PhoneIcon,
  UsersIcon,
} from '@yuki/ui/icons'

export const contactMethods = [
  {
    icon: <MailIcon className="h-8 w-8" />,
    title: 'Email Support',
    description: 'Get help from our support team',
    contact: 'support@yukinu.com',
    responseTime: 'Within 24 hours',
    availability: '24/7',
  },
  {
    icon: <PhoneIcon className="h-8 w-8" />,
    title: 'Phone Support',
    description: 'Speak directly with our team',
    contact: '+1 (555) 123-4567',
    responseTime: 'Immediate',
    availability: 'Mon-Fri, 9AM-6PM PST',
  },
  {
    icon: <MessageSquareIcon className="h-8 w-8" />,
    title: 'Live Chat',
    description: 'Chat with us in real-time',
    contact: 'Available on our website',
    responseTime: 'Within minutes',
    availability: 'Mon-Fri, 9AM-6PM PST',
  },
]

export const departments = [
  {
    icon: <HeadphonesIcon className="h-6 w-6" />,
    title: 'Customer Support',
    description: 'Account issues, order problems, technical help',
    email: 'support@yukinu.com',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: <BuildingIcon className="h-6 w-6" />,
    title: 'Business Partnerships',
    description: 'Seller onboarding, enterprise solutions, integrations',
    email: 'partnerships@yukinu.com',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: <UsersIcon className="h-6 w-6" />,
    title: 'Press & Media',
    description: 'Press inquiries, media kits, interviews',
    email: 'press@yukinu.com',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: <GlobeIcon className="h-6 w-6" />,
    title: 'General Inquiries',
    description: 'Questions about Yukinu, feedback, suggestions',
    email: 'hello@yukinu.com',
    color: 'bg-orange-50 text-orange-600',
  },
]

export const offices = [
  {
    city: 'San Francisco',
    country: 'United States',
    address: '123 Market Street, Suite 400\nSan Francisco, CA 94105',
    phone: '+1 (555) 123-4567',
    email: 'sf@yukinu.com',
    image: '/assets/hero-2.webp',
    isHeadquarters: true,
  },
  {
    city: 'London',
    country: 'United Kingdom',
    address: '45 Shoreditch High Street\nLondon E1 6PN',
    phone: '+44 20 7123 4567',
    email: 'london@yukinu.com',
    image: '/assets/hero-3.webp',
    isHeadquarters: false,
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    address: '1-2-3 Shibuya, Shibuya City\nTokyo 150-0002',
    phone: '+81 3-1234-5678',
    email: 'tokyo@yukinu.com',
    image: '/assets/hero-4.webp',
    isHeadquarters: false,
  },
]
