import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from '@yukinu/ui/icons'
import { Typography } from '@yukinu/ui/typography'

export const ContactInfo: React.FC = () => (
  <div className='space-y-4 px-4'>
    {contactInfo.map((info) => (
      <div key={info.title} className='flex gap-4'>
        <div className='flex size-10 shrink-0 items-center justify-center rounded-lg border border-accent bg-accent/20'>
          <info.icon className='size-5 text-accent-foreground' />
        </div>
        <div>
          <Typography variant='h5' className='my-0' render={<p />}>
            {info.title}
          </Typography>
          {info.details.map((detail) => (
            <Typography key={detail} className='text-muted-foreground'>
              {detail}
            </Typography>
          ))}
        </div>
      </div>
    ))}
  </div>
)

const contactInfo = [
  {
    title: 'Email',
    icon: MailIcon,
    details: ['support@tiesen.id.vn'],
  },
  {
    title: 'Phone',
    icon: PhoneIcon,
    details: ['(+67) 727 102 3618', 'Monday - Friday, 9am - 5pm EST'],
  },
  {
    title: 'Address',
    icon: MapPinIcon,
    details: ['67 Skibidi Street', 'Ligma City, Goon 693618', 'Earth'],
  },
  {
    title: 'Business Hours',
    icon: ClockIcon,
    details: [
      'Monday - Friday: 9am - 6pm',
      'Saturday: 10am - 4pm',
      'Sunday: Goon',
    ],
  },
]
