'use client'

import Image from 'next/image'

import { cn } from '@yukinu/ui'

import { usePage } from '@/app/(main)/[slug]/page.provider'

export const ProductImages: React.FC = () => {
  const {
    product: { id, images },
    currentImage,
    handleChangeImage,
  } = usePage()

  return (
    <section className='flex flex-col gap-4 overflow-hidden'>
      <h3 className='sr-only'>Product Images section</h3>

      <div className='relative aspect-square w-full rounded-md border'>
        <Image
          src={currentImage ?? '/assets/logo.svg'}
          alt={`${id}-main-image`}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          className={cn('rounded-md object-contain p-0.5', {
            'dark:invert': !currentImage,
          })}
          fill
        />
      </div>

      <div className='flex items-center gap-4 overflow-x-auto overflow-y-hidden pb-2'>
        {images.map(({ id, url }) => (
          <button
            key={id}
            className={cn(
              'relative aspect-square size-20 shrink-0 rounded-md border transition-colors',
              { 'border-primary bg-accent/40': currentImage === url },
            )}
            onClick={() => {
              handleChangeImage(url)
            }}
          >
            <Image
              src={url}
              alt={`thumbnail-${id}`}
              className='rounded-md object-contain p-0.5'
              fill
            />
          </button>
        ))}
      </div>
    </section>
  )
}
