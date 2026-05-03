import { VendorEntity } from '@yukinu/api/merchant'
import { Button } from '@yukinu/ui/button'
import { Input } from '@yukinu/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@yukinu/ui/select'
import { useState } from 'react'

export const VendorSearchForm: React.FC<{
  query: { search: string; status: VendorEntity.Status | null }
  onSearch: (opts: {
    search?: string
    status?: VendorEntity.Status | null
  }) => void
}> = ({ query, onSearch }) => {
  const [search, setSearch] = useState(query.search)
  const [status, setStatus] = useState<VendorEntity.Status | null>(query.status)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onSearch({ search, status })
      }}
      className='flex w-full items-center gap-2'
    >
      <div className='flex items-center gap-2'>
        <Input
          placeholder='Search vendors...'
          value={search}
          className='max-w-sm'
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder='Filter by status' />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value=''>All Statuses</SelectItem>
            {VendorEntity.statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type='submit'>Search</Button>
    </form>
  )
}
