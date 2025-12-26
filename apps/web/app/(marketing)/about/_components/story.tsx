import { Typography } from '@yukinu/ui/typography'

export const StorySection: React.FC = () => (
  <section className='bg-card py-16 text-card-foreground'>
    <h2 className='sr-only'>Our Story section</h2>

    <article className='container [&>p]:text-muted-foreground'>
      <Typography variant='h3'>Our Story</Typography>

      <Typography>
        Yukinu was founded with a simple observation: the most successful online
        marketplaces give equal opportunity to sellers of all sizes while
        providing buyers with unmatched product variety and reliability.
      </Typography>
      <Typography>
        We saw friction in traditional e-commerce where hidden costs,
        complicated seller onboarding, and opaque policies frustrated both
        merchants and customers. We decided to build something different.
      </Typography>
      <Typography>
        Starting as a lean team of e-commerce and technology enthusiasts, we
        created Yukinu to be the anti-intermediary platform. We prioritize
        seller success, invest in buyer protection, and use technology to
        eliminate unnecessary complexity.
      </Typography>
      <Typography>
        Today, Yukinu serves thousands of sellers and millions of shoppers,
        growing steadily by maintaining our core principles: fairness,
        transparency, and a relentless focus on user experience.
      </Typography>
    </article>
  </section>
)
