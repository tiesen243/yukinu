import { Button } from '@yukinu/ui/button'
import { Input } from '@yukinu/ui/input'
import { useState } from 'react'

export const VendorSearchForm: React.FC<{
  query: string
  onSearch: (opts: { search?: string }) => void
}> = ({ query, onSearch }) => {
  const [search, setSearch] = useState(query)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onSearch({ search })
      }}
      className='flex w-full items-center gap-2'
    >
      <Input
        placeholder='Search vendors...'
        value={search}
        className='max-w-sm'
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button type='submit'>Search</Button>
    </form>
  )
}
