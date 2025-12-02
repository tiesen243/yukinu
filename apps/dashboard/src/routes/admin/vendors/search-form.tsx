import { Button } from '@yukinu/ui/button'
import { SearchIcon } from '@yukinu/ui/icons'
import { Input } from '@yukinu/ui/input'

import { useVendorQueryStates } from '@/routes/admin/vendors/hook'

export const SearchForm: React.FC = () => {
  const [query, setQuery] = useVendorQueryStates()

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
