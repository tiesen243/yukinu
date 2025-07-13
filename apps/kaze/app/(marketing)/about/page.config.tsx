import {
  GlobeIcon,
  HeartIcon,
  LightbulbIcon,
  ShieldIcon,
  TargetIcon,
  TrendingUpIcon,
  UsersIcon,
} from '@yuki/ui/icons'

export const values = [
  {
    icon: <HeartIcon className='h-8 w-8' />,
    title: 'Customer First',
    description:
      'Every decision we make starts with our customers. We listen, learn, and build solutions that truly matter to the people who use our platform every day.',
  },
  {
    icon: <LightbulbIcon className='h-8 w-8' />,
    title: 'Innovation',
    description:
      'We embrace cutting-edge technology and creative thinking to solve complex problems and create experiences that delight our users.',
  },
  {
    icon: <ShieldIcon className='h-8 w-8' />,
    title: 'Trust & Security',
    description:
      "We build trust through transparency, reliability, and unwavering commitment to protecting our users' data and privacy.",
  },
  {
    icon: <GlobeIcon className='h-8 w-8' />,
    title: 'Global Impact',
    description:
      "We're creating a platform that connects people worldwide, breaking down barriers and enabling commerce across cultures and borders.",
  },
]

export const timeline = [
  {
    year: '2020',
    title: 'The Beginning',
    description:
      'Founded by a team of e-commerce veterans who saw the need for a more intelligent shopping platform.',
  },
  {
    year: '2021',
    title: 'First Million Users',
    description:
      'Reached our first million users and launched our AI-powered recommendation engine.',
  },
  {
    year: '2022',
    title: 'Global Expansion',
    description:
      'Expanded to 15 countries and introduced multi-language support and local payment methods.',
  },
  {
    year: '2023',
    title: 'Mobile Revolution',
    description:
      'Launched our award-winning mobile app, which now accounts for 70% of our traffic.',
  },
  {
    year: '2024',
    title: 'AI Innovation',
    description:
      'Introduced advanced AI features including visual search and personalized shopping assistants.',
  },
]

export const team = [
  {
    name: 'Tran Tien',
    role: 'CEO & Co-Founder',
    bio: 'Former VP of Product at major e-commerce platforms. Passionate about creating user-centric experiences.',
    image: 'https://github.com/tiesen243.png',
  },
  {
    name: 'Tiesen',
    role: 'CTO & Co-Founder',
    bio: 'AI and machine learning expert with 15+ years in building scalable platforms.',
    image: 'https://github.com/tiesen243.png',
  },
  {
    name: 'Tien',
    role: 'Head of Design',
    bio: 'Award-winning designer focused on creating beautiful, accessible user experiences.',
    image: 'https://github.com/tiesen243.png',
  },
  {
    name: 'Tien Tran',
    role: 'VP of Engineering',
    bio: 'Infrastructure expert who ensures our platform scales to serve millions of users globally.',
    image: 'https://github.com/tiesen243.png',
  },
]

export const stats = [
  {
    number: '50M+',
    label: 'Products Listed',
    icon: <TargetIcon className='h-6 w-6' />,
  },
  {
    number: '1M+',
    label: 'Active Users',
    icon: <UsersIcon className='h-6 w-6' />,
  },
  {
    number: '25+',
    label: 'Countries',
    icon: <GlobeIcon className='h-6 w-6' />,
  },
  {
    number: '99.9%',
    label: 'Uptime',
    icon: <TrendingUpIcon className='h-6 w-6' />,
  },
]
