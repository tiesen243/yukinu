'use client'

import { SearchIcon } from '@yukinu/ui/icons'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@yukinu/ui/input-group'
import Form from 'next/form'
import { useQueryStates } from 'nuqs'

import { productsOptions, productsParsers } from '@/lib/search'

export const SearchForm: React.FC = () => {
  const [query] = useQueryStates(productsParsers, productsOptions)

  return (
    <Form action='/search' className='flex-1'>
      <InputGroup>
        <InputGroupInput
          name='q'
          defaultValue={query.search ?? ''}
          placeholder='Search...'
          aria-label='Search'
        />
        <InputGroupAddon align='inline-end'>
          <InputGroupButton type='submit'>
            <SearchIcon />
            <span className='sr-only'>Search</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Form>
  )
}
