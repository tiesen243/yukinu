import { Typography } from '@yukinu/ui/typography'

export const TeamSection: React.FC = () => (
  <section className='container flex flex-col gap-8 py-20'>
    <Typography variant='h2' className='text-center'>
      Team Highlights
    </Typography>

    <ul className='grid gap-8 md:grid-cols-3'>
      {highlights.map((highlight) => (
        <li
          key={highlight.description}
          className='rounded-lg border-accent bg-accent/20 p-8 shadow-sm dark:border'
        >
          <Typography variant='h3' className='my-0 text-accent-foreground'>
            {highlight.number}
          </Typography>
          <Typography className='text-accent-foreground/70'>
            {highlight.description}
          </Typography>
        </li>
      ))}
    </ul>

    <Typography className='mx-auto mt-12 max-w-2xl text-center text-muted-foreground'>
      Our diverse team brings expertise across e-commerce, technology,
      operations, and customer service. We&apos;re united by our passion for
      building the best multi-vendor platform on the web.
    </Typography>
  </section>
)

const highlights = [
  {
    number: '300+',
    description: 'Team Members Worldwide',
  },
  {
    number: '50+',
    description: 'Countries Represented',
  },
  {
    number: '15+',
    description: 'Years Combined Experience',
  },
]
