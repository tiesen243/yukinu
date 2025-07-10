import Form from 'next/form'

import { SearchIcon } from '@yuki/ui/icons'
import { Input } from '@yuki/ui/input'

export function Search() {
  return (
    <Form action="/search" className="relative flex-1">
      <Input
        name="q"
        placeholder="Search products..."
        className="w-full pr-8"
      />
      <button
        type="submit"
        className="text-muted-foreground hover:text-foreground absolute top-0 right-0 inline-flex h-full items-center px-2"
      >
        <SearchIcon className="size-4" />
        <span className="sr-only">Search</span>
      </button>
    </Form>
  )
}
