'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'
import { Card } from '@yukinu/ui/card'
import { Typography } from '@yukinu/ui/typography'

import { usePage } from '@/app/(main)/[slug]/page.provider'

export const ProductReviews: React.FC = () => {
  const {
    product: { reviews },
    avgRating,
  } = usePage()

  return (
    <Card className='px-6' render={<section />}>
      <Typography
        variant='h4'
        render={<h2>Reviews ({avgRating.toFixed(1)}/5)</h2>}
      />

      {reviews.length === 0 ? (
        <Typography className='text-muted-foreground'>
          No reviews yet.
        </Typography>
      ) : (
        <ul className='grid gap-4'>
          {reviews.map((review) => (
            <li
              key={review.id}
              className='flex items-start gap-4 border-b pb-4 last:border-0'
            >
              <Avatar className='size-9'>
                <AvatarImage
                  src={review.user.image ?? ''}
                  alt={review.user.username}
                />
                <AvatarFallback>
                  {review.user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className='flex flex-col gap-1'>
                <p className='font-medium'>{review.user.username}</p>
                <span className='text-xs text-muted-foreground'>
                  Rating: {review.rating}/5 - {review.createdAt.toDateString()}
                </span>

                <p className='mt-2 text-sm'>{review.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
