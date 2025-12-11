export const TeamSection: React.FC = () => (
  <section className='container py-20'>
    <h2 className='mb-12 text-center text-3xl font-bold'>Team Highlights</h2>

    <div className='grid gap-8 md:grid-cols-3'>
      {highlights.map((highlight) => (
        <div
          key={highlight.description}
          className='rounded-lg border-accent bg-accent/20 p-8 shadow-sm dark:border dark:bg-accent/10'
        >
          <div className='mb-2 text-4xl font-bold text-accent-foreground'>
            {highlight.number}
          </div>
          <p className='text-accent-foreground/70'>{highlight.description}</p>
        </div>
      ))}
    </div>

    <p className='mx-auto mt-12 max-w-2xl text-center text-muted-foreground'>
      Our diverse team brings expertise across e-commerce, technology,
      operations, and customer service. We're united by our passion for building
      the best multi-vendor platform on the web.
    </p>
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
