'use client'

import { Card } from '@yukinu/ui/card'
import { Typography } from '@yukinu/ui/typography'

import { usePage } from '@/app/(main)/[slug]/page.provider'

export const ProductDescription: React.FC = () => {
  const {
    product: { description, attributes },
  } = usePage()

  return (
    <Card render={<section className='px-4' />}>
      <Typography variant='h4' render={<h2>Overview</h2>} />
      <Typography className='overflow-x-auto whitespace-pre-wrap'>
        {description?.split('\\n').join('\n')}
      </Typography>

      <section>
        <Typography variant='h5' render={<h3>Specifications</h3>} />
        <Typography variant='ul' className='capitalize'>
          {attributes.map((attr) => (
            <li key={attr.name}>
              <strong>{attr.name}:</strong> {attr.value}
            </li>
          ))}
        </Typography>
      </section>
    </Card>
  )
}
