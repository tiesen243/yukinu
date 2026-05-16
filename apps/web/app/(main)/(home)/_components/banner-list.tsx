'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { cn } from '@yukinu/ui'
import { ChevronLeftIcon, ChevronRightIcon } from '@yukinu/ui/icons'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import { useTRPC } from '@/lib/trpc'

export const BannersList: React.FC = () => {
  const [imageIdx, setImageIdx] = useState(0)
  const [direction, setDirection] = useState<'next' | 'previous'>('next')

  const { trpc } = useTRPC()
  const { data } = useSuspenseQuery(trpc.sales.banner.all.queryOptions())
  const totalBanners = data.length

  if (totalBanners === 0) return <BannersListSkeleton />

  const handlePrevious = useCallback(() => {
    setDirection('previous')
    setImageIdx((prev) => (prev - 1 + totalBanners) % totalBanners)
  }, [totalBanners])

  const handleNext = useCallback(() => {
    setDirection('next')
    setImageIdx((prev) => (prev + 1) % totalBanners)
  }, [totalBanners])

  const handleDotClick = useCallback(
    (idx: number) => {
      if (idx === imageIdx) return
      setDirection(idx > imageIdx ? 'next' : 'previous')
      setImageIdx(idx)
    },
    [imageIdx],
  )

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.hidden || !document.hasFocus() || totalBanners <= 1) return

      setDirection('next')
      setImageIdx((prev) => (prev + 1) % totalBanners)
    }, 5000)

    return () => clearInterval(interval)
  }, [totalBanners])

  return (
    <div className='relative h-full w-full overflow-hidden rounded-xl'>
      {data.map((banner, idx) => {
        const isActive = idx === imageIdx

        return (
          <div
            key={banner.id}
            data-active={isActive}
            data-direction={direction}
            className={cn(
              'absolute inset-0 h-full w-full rounded-xl duration-500 ease-in-out',
              'data-[active=false]:animate-out data-[active=true]:animate-in',
              'data-[direction=next]:data-[active=false]:slide-out-to-left data-[direction=next]:data-[active=true]:slide-in-from-right',
              'data-[direction=previous]:data-[active=false]:slide-out-to-right data-[direction=previous]:data-[active=true]:slide-in-from-left',
              {
                'z-10': isActive,
                'pointer-events-none z-0': !isActive,
              },
            )}
          >
            <Image
              src={banner.url}
              alt={banner.id}
              className='rounded-xl object-cover object-top'
              priority={idx === 0}
              fill
            />
          </div>
        )
      })}

      <button
        type='button'
        aria-label='Previous banner'
        className={cn(
          'absolute top-0 left-0 z-20 flex h-full w-12 items-center justify-center',
          'bg-linear-to-r from-black/50 to-black/5 transition-all duration-200',
          'hover:from-black/60 hover:to-black/10',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'group',
        )}
        onClick={handlePrevious}
      >
        <ChevronLeftIcon className='size-6 text-white transition-colors group-hover:text-white/80' />
      </button>

      <button
        type='button'
        aria-label='Next banner'
        className={cn(
          'absolute top-0 right-0 z-20 flex h-full w-12 items-center justify-center',
          'bg-linear-to-l from-black/50 to-black/5 transition-all duration-200',
          'hover:from-black/60 hover:to-black/10',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'group',
        )}
        onClick={handleNext}
      >
        <ChevronRightIcon className='h-6 w-6 text-white transition-colors group-hover:text-white/80' />
      </button>

      <div className='absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2'>
        {data.map((_, idx) => (
          <button
            key={idx}
            type='button'
            aria-label={`Go to banner ${idx + 1}`}
            aria-current={idx === imageIdx ? 'true' : 'false'}
            className={cn(
              'h-2 w-2 rounded-full transition-all duration-300',
              idx === imageIdx
                ? 'w-8 bg-white'
                : 'bg-white/60 hover:bg-white/80',
              'disabled:cursor-not-allowed',
            )}
            onClick={() => handleDotClick(idx)}
          />
        ))}
      </div>
    </div>
  )
}

export const BannersListSkeleton: React.FC = () => (
  <div className='flex h-full w-full items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground'>
    No banners available
  </div>
)
