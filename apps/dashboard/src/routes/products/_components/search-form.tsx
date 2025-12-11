import { Button } from '@yukinu/ui/button'
import { PackageIcon, SearchIcon, Trash2Icon } from '@yukinu/ui/icons'
import { Input } from '@yukinu/ui/input'

import { useProductQueryStates } from '@/routes/products/_hook'

export const SearchForm: React.FC = () => {
  const [query, setQuery] = useProductQueryStates()

  return (
    <form
      className='flex items-center gap-2 md:w-1/2 lg:w-1/3'
      onSubmit={async (e) => {
        e.preventDefault()
        const rawQ = new FormData(e.currentTarget).get('q')
        const q = typeof rawQ === 'string' ? rawQ.trim() : ''
        if (q === query.search) return

        await setQuery((prev) => ({ ...prev, search: q, page: 1 }))
      }}
    >
      <Input
        name='q'
        defaultValue={query.search ?? ''}
        placeholder='Search...'
      />
      <Button type='submit' variant='ghost' size='icon'>
        <SearchIcon /> <span className='sr-only'>Search</span>
      </Button>
    </form>
  )
}

export const ToggleProductStatusButton = () => {
  const [query, setQuery] = useProductQueryStates()

  return (
    <Button
      variant='outline'
      onClick={() =>
        setQuery((prev) => ({
          ...prev,
          isDeleted: !prev.isDeleted,
          page: 1,
        }))
      }
    >
      {query.isDeleted ? <PackageIcon /> : <Trash2Icon />}
      <span className='sr-only md:not-sr-only'>
        {query.isDeleted ? 'All Products' : 'Deleted Products'}
      </span>
    </Button>
  )
}
