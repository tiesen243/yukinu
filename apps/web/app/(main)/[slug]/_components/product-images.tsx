import Image from 'next/image'

import { cn } from '@yukinu/ui'

import { usePage } from '@/app/(main)/[slug]/page.provider'

export const ProductImages: React.FC = () => {
  const {
    product: { name, images },
    currentImage,
    handleChangeImage,
  } = usePage()

  return (
    <section className='flex flex-col gap-4 overflow-hidden'>
      <h3 className='sr-only'>Product Images section</h3>

      <div className='relative aspect-square w-full rounded-md border'>
        <Image
          src={currentImage ?? '/assets/logo.svg'}
          alt={`${name}-image`}
          className={cn('object-contain p-4', {
            'dark:invert': !currentImage,
          })}
          fill
        />
      </div>

      <div className='flex items-center gap-4 overflow-x-auto pb-2'>
        {images.map(({ id, url }) => (
          <button
            key={id}
            className={cn(
              'aspect-square size-20 shrink-0 rounded-md border transition-colors',
              { 'border-primary bg-accent/40': currentImage === url },
            )}
            onClick={() => {
              handleChangeImage(url)
            }}
          >
            <div className='relative aspect-square w-full'>
              <Image
                src={url}
                alt={`${name}-thumbnail-${id}`}
                className='object-contain p-1'
                fill
              />
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
