import { UserValidators } from '@yukinu/validators/user'
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs'

const parser = {
  search: parseAsString,
  role: parseAsStringEnum([...UserValidators.roles]),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
}

const options = { urlKeys: { search: 'q' } }

export const useUserQueryStates = () => useQueryStates(parser, options)
