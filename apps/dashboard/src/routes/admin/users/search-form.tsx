import { Button } from '@yukinu/ui/button'
import { SearchIcon } from '@yukinu/ui/icons'
import { Input } from '@yukinu/ui/input'
import { Select, SelectOption } from '@yukinu/ui/select'
import { UserValidators } from '@yukinu/validators/user'

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
        className='w-fit'
        defaultValue={query.role ?? ''}
      >
        <SelectOption value=''>all</SelectOption>
        {UserValidators.roles.map((role) => (
          <SelectOption key={role} value={role}>
            {role.split('_').join(' ')}
          </SelectOption>
        ))}
      </Select>

      <Button type='submit' variant='ghost' size='icon'>
        <SearchIcon /> <span className='sr-only'>Search</span>
      </Button>
    </form>
  )
}
