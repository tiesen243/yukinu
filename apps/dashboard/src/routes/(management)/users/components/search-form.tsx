import { UserEntity } from '@yukinu/api/identity'
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

export const UserSearchForm: React.FC<{
  query: {
    search: string
    role: UserEntity.Role | null
    isDeleted: boolean
  }
  onSearch: (opts: {
    search?: string
    role?: UserEntity.Role | null
    isDeleted?: boolean
  }) => void
}> = ({ query, onSearch }) => {
  const [search, setSearch] = useState(query.search)
  const [role, setRole] = useState<UserEntity.Role | null>(query.role)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onSearch({ search, role })
      }}
      className='flex w-full items-center gap-2'
    >
      <Input
        placeholder='Search users...'
        value={search}
        className='max-w-sm'
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger>
          <SelectValue placeholder='Filter by role' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value=''>All Roles</SelectItem>
          {UserEntity.roles.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type='submit'>Search</Button>

      <Button
        className='ml-auto'
        variant='outline'
        onClick={() => onSearch({ isDeleted: !query.isDeleted })}
      >
        {query.isDeleted ? 'Show Active Users' : 'Show Deleted Users'}
      </Button>
    </form>
  )
}
