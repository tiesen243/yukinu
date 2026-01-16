import { cn } from '@yukinu/ui'
import { Button } from '@yukinu/ui/button'

export const ProductPagination: React.FC<{
  pagination: { totalPages: number }
  query: { page: number }
  goToPage: (page: number) => Promise<void>
  className?: string
}> = ({ pagination, query, goToPage, className = '' }) => {
  return (
    <section
      className={cn('flex items-center justify-center gap-2', className)}
    >
      <h3 className='sr-only'>Products Pagination section</h3>

      {getPaginationRange(query.page, pagination.totalPages).map(
        (item, idx) => (
          <Button
            key={`pagination-item-${idx}`}
            variant='outline'
            size='icon'
            onClick={() => goToPage(Number(item))}
            disabled={item === '...' || item === query.page}
          >
            {item}
          </Button>
        ),
      )}
    </section>
  )
}

function getPaginationRange(cp: number, tp: number): (number | string)[] {
  if (tp <= 7) {
    return Array.from({ length: tp }, (_, i) => i + 1)
  }

  const range: (number | string)[] = []
  if (cp <= 4) {
    range.push(1, 2, 3, 4, 5, '...', tp)
  } else if (cp >= tp - 3) {
    range.push(1, '...', tp - 4, tp - 3, tp - 2, tp - 1, tp)
  } else {
    range.push(1, '...', cp - 1, cp, cp + 1, '...', tp)
  }
  return range
}
