import { HeartIcon, TargetIcon, UsersIcon, ZapIcon } from '@yukinu/ui/icons'

export const CoreValuesSection: React.FC = () => (
  <section className='container py-20'>
    <h2 className='mb-12 text-center text-3xl font-bold text-foreground'>
      Our Core Values
    </h2>

    <section className='grid gap-8 md:grid-cols-4'>
      <h3 className='sr-only'>Core Values section</h3>

      {values.map((value) => (
        <section key={value.title} className='text-center'>
          <div className='mb-4 inline-flex size-12 items-center justify-center rounded-full bg-accent'>
            <value.icon className='size-6 text-accent-foreground' />
          </div>
          <h4 className='mb-2 font-bold'>{value.title}</h4>
          <p className='text-sm text-muted-foreground'>{value.description}</p>
        </section>
      ))}
    </section>
  </section>
)

const values = [
  {
    icon: HeartIcon,
    title: 'Trust',
    description:
      'We build trust through transparency, secure transactions, and protecting both buyers and sellers.',
  },
  {
    icon: ZapIcon,
    title: 'Innovation',
    description:
      'We continuously improve our platform with cutting-edge technology and user-centric features.',
  },
  {
    icon: UsersIcon,
    title: 'Community',
    description:
      'We foster a vibrant community where sellers grow together and customers feel supported.',
  },
  {
    icon: TargetIcon,
    title: 'Excellence',
    description:
      'We pursue excellence in every detail, from product quality to customer service.',
  },
]
