'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'
import { Card } from '@yukinu/ui/card'
import { Typography } from '@yukinu/ui/typography'

import { usePage } from '@/app/(main)/[slug]/page.provider'
import { Link } from '@/components/link'

export const ProductReviews: React.FC = () => {
  const {
    product: { reviews },
    avgRating,
  } = usePage()

  return (
    <Card className='px-4' render={<section />}>
      <Typography variant='h2'>Reviews ({avgRating.toFixed(1)}/5.0)</Typography>

      {reviews.length === 0 ? (
        <Typography className='text-muted-foreground'>
          No reviews yet.
        </Typography>
      ) : (
        <ul className='grid gap-4'>
          {reviews.map((review) => (
            <li
              key={review.createdAt.getTime()}
              className='flex items-start gap-4 border-b pb-4 last:border-0'
            >
              <Avatar
                className='size-9 cursor-pointer'
                aria-label={`View profile of ${review.user.username}`}
                render={<Link href={`/u/${review.user.id}` as never} />}
              >
                <AvatarImage
                  src={review.user.image ?? ''}
                  alt={review.user.username}
                />
                <AvatarFallback>
                  {review.user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className='flex flex-col gap-1'>
                <Link
                  href={`/u/${review.user.id}` as never}
                  className='cursor-pointer font-medium'
                >
                  {review.user.fullName ?? review.user.username}
                </Link>
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
