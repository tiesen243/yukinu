import { Typography } from '@yukinu/ui/typography'

export const MapSection: React.FC = () => (
  <section className='container py-12'>
    <div className='mb-12 text-center'>
      <Typography variant='h2'>Visit Our Office</Typography>
      <Typography className='text-muted-foreground'>
        Stop by for a chat or reach out via any of our contact methods
      </Typography>
    </div>

    <div className='h-96 overflow-hidden rounded-xl bg-card shadow-sm'>
      <iframe
        title='Company Location'
        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3458.247682914449!2d-96.11188493782088!3d29.91477087488484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86414982bbfe16a3%3A0x678d7056b4e641f!2sCunny%20Lake!5e0!3m2!1sen!2s!4v1765427664171!5m2!1sen!2s'
        width='100%'
        height='100%'
        loading='lazy'
        className='border-0'
        referrerPolicy='no-referrer-when-downgrade'
        sandbox=''
        allowFullScreen
      />
    </div>
  </section>
)
