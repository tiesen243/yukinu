'use client'

import * as React from 'react'

import { Badge } from '@yuki/ui/badge'
import { Button } from '@yuki/ui/button'
import { Card, CardContent, CardFooter } from '@yuki/ui/card'
import { ChevronDownIcon, SearchIcon } from '@yuki/ui/icons'
import { Input } from '@yuki/ui/input'
import { Typography } from '@yuki/ui/typography'

import { faqs } from './page.config'

const FaqContext = React.createContext<{
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredFAQs: typeof faqs
  popularFAQs: typeof faqs
  expandedItems: number[]
  toggleExpanded: (id: number) => void
} | null>(null)

const useFaq = () => {
  const context = React.use(FaqContext)
  if (!context) throw new Error('useFaq must be used within a FaqProvider')
  return context
}

export function FaqProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [searchQuery, setSearchQuery] = React.useState('')

  const [expandedItems, setExpandedItems] = React.useState<number[]>([])

  const toggleExpanded = React.useCallback(
    (id: number) => {
      setExpandedItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      )
    },
    [setExpandedItems],
  )

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const popularFAQs = faqs.filter((faq) => faq.popular)

  const value = React.useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      filteredFAQs,
      popularFAQs,
      expandedItems,
      toggleExpanded,
    }),
    [
      searchQuery,
      setSearchQuery,
      filteredFAQs,
      popularFAQs,
      expandedItems,
      toggleExpanded,
    ],
  )
  return <FaqContext value={value}>{children}</FaqContext>
}

export const FaqSearch = () => {
  const { searchQuery, setSearchQuery } = useFaq()

  return (
    <div className='relative mx-auto mb-8 max-w-2xl'>
      <SearchIcon className='absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-muted-foreground' />
      <Input
        placeholder='Search for answers...'
        className='py-4 pr-4 pl-12 text-lg'
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value)
        }}
      />
    </div>
  )
}

export const FaqList = () => {
  const { searchQuery, setSearchQuery, filteredFAQs, popularFAQs } = useFaq()

  return (
    <>
      {!searchQuery && (
        <section className='container py-16'>
          <Typography variant='h2' className='mb-12 text-center'>
            Popular Questions
          </Typography>

          <div className='space-y-4'>
            {popularFAQs.map((faq) => (
              <FaqCard key={faq.id} faq={faq} />
            ))}
          </div>
        </section>
      )}

      <section className='container py-16'>
        {searchQuery && (
          <div className='mb-8'>
            <Typography variant='h3' className='mb-2'>
              Search Results
            </Typography>
            <Typography variant='p' className='text-muted-foreground'>
              Found {filteredFAQs.length} result
              {filteredFAQs.length !== 1 ? 's' : ''} for "{searchQuery}"
            </Typography>
          </div>
        )}

        {!searchQuery && (
          <Typography variant='h2' className='mb-12 text-center'>
            All Questions & Answers
          </Typography>
        )}

        <div className='space-y-4'>
          {(searchQuery ? filteredFAQs : faqs).map((faq) => (
            <FaqCard key={faq.id} faq={faq} />
          ))}
        </div>

        {searchQuery && filteredFAQs.length === 0 && (
          <div className='py-12 text-center'>
            <Typography variant='h4' className='mb-4'>
              No results found
            </Typography>
            <Typography variant='p' className='mb-6 text-muted-foreground'>
              We couldn't find any questions matching your search. Try different
              keywords or browse our categories.
            </Typography>
            <Button
              onClick={() => {
                setSearchQuery('')
              }}
            >
              Browse All Questions
            </Button>
          </div>
        )}
      </section>
    </>
  )
}

const FaqCard = ({ faq }: Readonly<{ faq: (typeof faqs)[number] }>) => {
  const { expandedItems, toggleExpanded } = useFaq()
  const contentRef = React.useRef<HTMLDivElement>(null)

  return (
    <Card
      ref={contentRef}
      data-expanded={expandedItems.includes(faq.id)}
      className='group/faq h-16 overflow-hidden py-4 shadow-sm transition-[height,shadow] duration-200 ease-in-out hover:shadow-md data-[expanded=true]:h-(--height)'
      style={
        {
          '--height': `${contentRef.current?.scrollHeight ?? 0}px`,
        } as React.CSSProperties
      }
    >
      <CardContent className='px-4'>
        <button
          type='button'
          className='flex w-full items-center justify-between gap-4'
          onClick={() => {
            toggleExpanded(faq.id)
          }}
        >
          {faq.popular && <Badge variant='secondary'>Popular</Badge>}
          <Typography
            variant='h5'
            className='mb-0 line-clamp-1 flex-1 text-left'
          >
            {faq.question}
          </Typography>

          <ChevronDownIcon className='size-5 text-muted-foreground transition-transform duration-200 ease-in-out group-data-[expanded=true]/faq:rotate-180' />
        </button>
      </CardContent>
      <CardFooter className='px-4'>
        <Typography>{faq.answer}</Typography>
      </CardFooter>
    </Card>
  )
}
