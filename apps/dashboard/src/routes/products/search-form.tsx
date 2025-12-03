import { Button } from '@yukinu/ui/button'
import { RefreshCwIcon, SearchIcon, Trash2Icon } from '@yukinu/ui/icons'
import { Input } from '@yukinu/ui/input'

import { useProductQueryStates } from '@/routes/products/hook'

export const SearchForm: React.FC = () => {
  const [query, setQuery] = useProductQueryStates()

  return (
    <form
      className='my-6 flex items-center gap-2 md:w-1/2 lg:w-1/3'
      onSubmit={async (e) => {
        e.preventDefault()
        const rawQ = new FormData(e.currentTarget).get('q')
        const q = typeof rawQ === 'string' ? rawQ.trim() : ''
        if (q === query.search) return

        await setQuery((prev) => ({ ...prev, search: q, page: 1 }))
      }}
    >
      <Input name='q' defaultValue={query.search} placeholder='Search...' />
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
      size='icon'
      onClick={() =>
        setQuery((prev) => ({
          ...prev,
          status: prev.status === 'active' ? 'inactive' : 'active',
          page: 1,
        }))
      }
    >
      {query.status === 'active' ? <Trash2Icon /> : <RefreshCwIcon />}
      <span className='sr-only'>
        {query.status === 'active'
          ? 'Show Inactive Products'
          : 'Show Active Products'}
      </span>
    </Button>
  )
}
