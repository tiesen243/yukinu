import { Button } from '@yukinu/ui/button'
import { SearchIcon } from '@yukinu/ui/icons'
import { Input } from '@yukinu/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@yukinu/ui/select'
import { roles } from '@yukinu/validators/auth'

import { useUserQueryStates } from '@/routes/admin/users/hook'

export const SearchForm: React.FC = () => {
  const [query, setQuery] = useUserQueryStates()

  return (
    <form
      className='flex items-center gap-2 md:w-1/2 lg:w-1/3'
      onSubmit={async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const rawQ = formData.get('q')
        const q = typeof rawQ === 'string' ? rawQ.trim() : ''

        const rawRole = formData.get('role')
        const role =
          typeof rawRole === 'string'
            ? rawRole === ''
              ? null
              : (rawRole as typeof query.role)
            : query.role
        if (q === query.search && role === query.role) return

        await setQuery((prev) => ({ ...prev, search: q, role, page: 1 }))
      }}
    >
      <Input
        name='q'
        defaultValue={query.search ?? ''}
        placeholder='Search...'
      />

      <Select
        id='role'
        name='role'
        defaultValue={query.role ?? ''}
        items={[
          ...roles.map((role) => ({
            label: role.split('_').join(' '),
            value: role,
          })),
          { label: 'all', value: '' },
        ]}
      >
        <SelectTrigger className='w-fit'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value=''>all</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role.split('_').join(' ')}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button type='submit' variant='ghost' size='icon'>
        <SearchIcon /> <span className='sr-only'>Search</span>
      </Button>
    </form>
  )
}
