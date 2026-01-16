'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'
import { Card, CardFooter, CardHeader } from '@yukinu/ui/card'
import { Typography } from '@yukinu/ui/typography'
import { useRouter } from 'next/navigation'

import { usePage } from '@/app/(main)/[slug]/page.provider'

export const ProductDescription: React.FC = () => {
  const {
    product: { vendor, description, attributes },
  } = usePage()
  const router = useRouter()

  return (
    <Card className='gap-0' render={<section />}>
      <h2 className='sr-only'>Product Description section</h2>

      {vendor && (
        <CardHeader
          className='flex cursor-pointer items-center gap-4 border-b'
          render={<section />}
          onClick={() => router.push(`/v/${vendor.id}`)}
          onMouseEnter={() => router.prefetch(`/v/${vendor.id}`)}
        >
          <Avatar className='size-14'>
            <AvatarImage src={vendor.image ?? ''} alt={vendor.name} />
            <AvatarFallback>
              {vendor.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Typography variant='h3' className='my-0'>
            {vendor.name}
          </Typography>
        </CardHeader>
      )}

      <CardFooter className='flex-col items-start' render={<section />}>
        <Typography variant='h4' render={<h3>Overview</h3>} />
        <Typography className='overflow-x-auto whitespace-pre-wrap'>
          {description?.split('\\n').join('\n')}
        </Typography>

        {attributes.length > 0 && (
          <section>
            <Typography variant='h5' render={<h4>Specifications</h4>} />
            <Typography variant='ul' className='capitalize'>
              {attributes.map((attr) => (
                <li key={attr.name}>
                  <strong>{attr.name}:</strong> {attr.value}
                </li>
              ))}
            </Typography>
          </section>
        )}
      </CardFooter>
    </Card>
  )
}
