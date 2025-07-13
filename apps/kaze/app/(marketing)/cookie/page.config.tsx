import {
  GlobeIcon,
  InfoIcon,
  MailIcon,
  SettingsIcon,
  ShieldIcon,
} from '@yuki/ui/icons'

export const cookieFeatures = [
  {
    icon: <GlobeIcon className='h-6 w-6' />,
    title: 'Transparency',
    description:
      'We provide clear information about the cookies we use and their purposes.',
  },
  {
    icon: <SettingsIcon className='h-6 w-6' />,
    title: 'Control',
    description:
      'You can manage your cookie preferences at any time through our settings.',
  },
  {
    icon: <ShieldIcon className='h-6 w-6' />,
    title: 'Security',
    description:
      'We implement strict security measures to protect your data and privacy.',
  },
]

export const cookieTypes = [
  {
    icon: <ShieldIcon className='h-6 w-6' />,
    title: 'Strictly Necessary Cookies',
    description:
      'These cookies are essential for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms.',
    examples: [
      'Session cookies for login',
      'Shopping cart functionality',
      'Security features',
    ],
  },
  {
    icon: <GlobeIcon className='h-6 w-6' />,
    title: 'Performance Cookies',
    description:
      'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.',
    examples: [
      'Google Analytics',
      'Site speed optimization',
      'Error reporting',
    ],
  },
  {
    icon: <InfoIcon className='h-6 w-6' />,
    title: 'Functional Cookies',
    description:
      'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.',
    examples: [
      'Remembering user preferences (language, region)',
      'Live chat support',
      'Video playback',
    ],
  },
  {
    icon: <MailIcon className='h-6 w-6' />,
    title: 'Targeting/Advertising Cookies',
    description:
      'These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.',
    examples: [
      'Retargeting ads',
      'Social media advertising',
      'Personalized content delivery',
    ],
  },
]
