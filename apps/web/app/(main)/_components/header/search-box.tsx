import { SearchIcon } from '@yukinu/ui/icons'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@yukinu/ui/input-group'

export const SearchBox: React.FC = () => {
  return (
    <InputGroup className='flex-1'>
      <InputGroupInput type='search' placeholder='Search...' />
      <InputGroupAddon align='inline-end'>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  )
}
