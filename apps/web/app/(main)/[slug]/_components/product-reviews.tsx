import { Avatar, AvatarFallback, AvatarImage } from '@yukinu/ui/avatar'

import { usePage } from '@/app/(main)/[slug]/page.provider'

export const ProductReviews: React.FC = () => {
  const {
    product: { reviews },
    avgRating,
  } = usePage()

  return (
    <section className='rounded-lg bg-card p-6 shadow-md'>
      <h3 className='mb-4 text-2xl font-semibold'>
        Reviews ({avgRating.toFixed(1)}/5)
      </h3>
      {reviews.length === 0 ? (
        <p className='text-sm text-muted-foreground'>No reviews yet.</p>
      ) : (
        <ul className='space-y-4'>
          {reviews.map((review) => (
            <li
              key={review.id}
              className='flex items-start gap-4 border-b pb-4'
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
                  Rating: {review.rating}/5
                </span>

                <p className='text-sm'>{review.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
