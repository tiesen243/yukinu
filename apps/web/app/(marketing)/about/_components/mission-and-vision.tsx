export const MissionAndVisionSection: React.FC = () => (
  <section className='bg-accent/20 py-16 text-accent-foreground dark:bg-accent/10'>
    <h2 className='sr-only'>Our Mission and Vision section</h2>

    <div className='container grid gap-12 md:grid-cols-2'>
      <section>
        <h3 className='mb-4 text-2xl font-bold'>Our Mission</h3>
        <p className='leading-relaxed text-accent-foreground/70'>
          We believe that great marketplaces empower individuals. Our mission is
          to democratize e-commerce by providing independent sellers with
          world-class tools and reaching millions of buyers looking for quality
          products at fair prices.
        </p>
      </section>

      <section>
        <h3 className='mb-4 text-2xl font-bold'>Our Vision</h3>
        <p className='leading-relaxed text-accent-foreground/70'>
          We envision a world where anyone can build a successful business
          online, where buyers discover products they love with confidence, and
          where commerce is efficient, fair, and accessible to all.
        </p>
      </section>
    </div>
  </section>
)
